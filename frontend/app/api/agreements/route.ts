import { getDatabase } from "@/lib/mongodb";
import type { CreateAgreementInput, IndexedAgreement } from "@/types/agreement";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const collectionName = "agreements";

export async function GET() {
  const db = await getDatabase();
  const agreements = await db
    .collection<IndexedAgreement>(collectionName)
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  return Response.json(
    { agreements },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const input = (await request.json()) as Partial<CreateAgreementInput>;

  if (!input.contractId || !input.title || !input.organization) {
    return Response.json(
      { error: "contractId, title and organization are required" },
      { status: 400 },
    );
  }

  const agreement: IndexedAgreement = {
    contractId: input.contractId,
    title: input.title,
    organization: input.organization,
    metadataUri: input.metadataUri ?? "",
    funder: input.funder ?? "",
    grantee: input.grantee ?? "",
    arbiter: input.arbiter ?? "",
    network: input.network ?? "testnet",
    milestones: input.milestones ?? [],
    createdAt: new Date().toISOString(),
  };

  const db = await getDatabase();
  await db
    .collection<IndexedAgreement>(collectionName)
    .updateOne(
      { contractId: agreement.contractId },
      { $set: agreement },
      { upsert: true },
    );

  return Response.json({ agreement });
}
