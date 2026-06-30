import { getDatabase } from "@/lib/mongodb";
import { readProjectEnv } from "@/lib/projectEnv";
import type { CreateAgreementInput, IndexedAgreement } from "@/types/agreement";
import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const execFileAsync = promisify(execFile);
const collectionName = "agreements";

export async function POST(request: Request) {
  const input = (await request.json()) as Partial<CreateAgreementInput>;
  const projectRoot = path.resolve(process.cwd(), "..");
  const env = await readProjectEnv();
  const source = env.SECRET_KEY;
  const owner = env.OWNER_ADDRESS ?? env.PUBLIC_KEY;

  if (!source || !owner) {
    return Response.json(
      { error: "SECRET_KEY and OWNER_ADDRESS are required in the root .env" },
      { status: 400 },
    );
  }

  if (!input.title || !input.organization || !input.metadataUri) {
    return Response.json(
      { error: "title, organization and metadataUri are required" },
      { status: 400 },
    );
  }

  const participants = {
    funder: input.funder || owner,
    grantee: input.grantee || owner,
    arbiter: input.arbiter || owner,
  };
  const milestones =
    input.milestones?.length && input.milestones.length > 0
      ? input.milestones
      : [{ id: 0, amount: "100", metadataUri: "ipfs://milestone-0" }];

  await execFileAsync("stellar", ["contract", "build"], {
    cwd: projectRoot,
    env: { ...process.env, CARGO_TARGET_DIR: "target" },
  });

  const wasmPath = path.join(
    projectRoot,
    "target",
    "wasm32v1-none",
    "release",
    "funding_agreement.wasm",
  );
  const deploy = await execFileAsync(
    "stellar",
    [
      "contract",
      "deploy",
      "--wasm",
      wasmPath,
      "--source",
      source,
      "--network",
      "testnet",
    ],
    { cwd: projectRoot },
  );
  const contractId = deploy.stdout.match(/\bC[A-Z0-9]{55}\b/)?.[0];

  if (!contractId) {
    return Response.json(
      { error: "Unable to recover deployed contract id" },
      { status: 500 },
    );
  }

  const config = {
    version: 1,
    settlement_adapter: owner,
    allow_partial_completion: false,
    requires_all_milestones: true,
  };

  await execFileAsync(
    "stellar",
    [
      "contract",
      "invoke",
      "--id",
      contractId,
      "--source",
      source,
      "--network",
      "testnet",
      "--send=yes",
      "--",
      "initialize",
      "--factory",
      owner,
      "--funder",
      participants.funder,
      "--grantee",
      participants.grantee,
      "--arbiter",
      participants.arbiter,
      "--metadata_uri",
      input.metadataUri,
      "--config",
      JSON.stringify(config),
      "--milestones",
      JSON.stringify(
        milestones.map((milestone) => [
          milestone.amount,
          milestone.metadataUri,
        ]),
      ),
    ],
    { cwd: projectRoot },
  );

  const agreement: IndexedAgreement = {
    contractId,
    title: input.title,
    organization: input.organization,
    metadataUri: input.metadataUri,
    funder: participants.funder,
    grantee: participants.grantee,
    arbiter: participants.arbiter,
    network: "testnet",
    milestones,
    createdAt: new Date().toISOString(),
  };

  const db = await getDatabase();
  await db
    .collection<IndexedAgreement>(collectionName)
    .updateOne({ contractId }, { $set: agreement }, { upsert: true });

  return Response.json({ agreement });
}
