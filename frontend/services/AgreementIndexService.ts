import type { CreateAgreementInput, IndexedAgreement } from "@/types/agreement";

export class AgreementIndexService {
  async list(): Promise<IndexedAgreement[]> {
    const response = await fetch("/api/agreements", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load indexed agreements");

    const data = (await response.json()) as { agreements: IndexedAgreement[] };
    return data.agreements;
  }

  async save(input: CreateAgreementInput): Promise<IndexedAgreement> {
    const response = await fetch("/api/agreements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const data = await readError(response);
      throw new Error(data.error ?? "Unable to save agreement");
    }

    const data = (await response.json()) as { agreement: IndexedAgreement };
    return data.agreement;
  }

  async deploy(input: CreateAgreementInput): Promise<IndexedAgreement> {
    const response = await fetch("/api/agreements/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    });

    if (!response.ok) {
      const data = await readError(response);
      throw new Error(data.error ?? "Unable to deploy agreement");
    }

    const data = (await response.json()) as { agreement: IndexedAgreement };
    return data.agreement;
  }
}

async function readError(response: Response) {
  try {
    return (await response.clone().json()) as { error?: string };
  } catch {
    return { error: await response.text() };
  }
}
