"use client";

import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAgreement } from "@/hooks/useAgreement";
import { useAgreementIndex } from "@/hooks/useAgreementIndex";
import { useDonation } from "@/hooks/useDonation";
import { useWallet } from "@/hooks/useWallet";
import type { CreateAgreementInput, IndexedMilestone } from "@/types/agreement";
import { type FormEvent, useMemo, useState } from "react";
import {
  enumTag,
  formatAmount,
  formatUnixTime,
  shortAddress,
} from "@/utils/format";

const mockOrganizations = [
  { name: "Pulso Foundation", region: "LATAM", verified: true },
  { name: "Andes Aid Network", region: "Peru", verified: true },
  { name: "LatAm Learning DAO", region: "Regional", verified: false },
];

const mockDisbursements = [
  { id: "DSB-1042", milestone: "Design", amount: "100 XLM", state: "Ready" },
  { id: "DSB-1043", milestone: "Delivery", amount: "250 XLM", state: "Pending" },
  { id: "DSB-1044", milestone: "Audit", amount: "80 XLM", state: "Queued" },
];

type Section = "dashboard" | "agreements" | "organizations" | "disbursements";

const sectionTitles: Record<Section, string> = {
  dashboard: "Dashboard",
  agreements: "Funding Agreements",
  organizations: "Organizations",
  disbursements: "Disbursements",
};

export function DashboardPage() {
  const {
    contractId,
    agreement,
    milestones,
    activate,
    pause,
    resume,
    submitMilestone,
    approveMilestone,
    rejectMilestone,
    completeMilestone,
    setContractId,
  } = useAgreement();
  const { agreements: indexedAgreements, deployAgreement } = useAgreementIndex();
  const { donate } = useDonation();
  const { isConnected } = useWallet();
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [donationNotice, setDonationNotice] = useState<string | null>(null);
  const [donationAmountByMilestone, setDonationAmountByMilestone] = useState<
    Record<number, string>
  >({});

  const completedMilestones =
    milestones.data?.filter(
      (milestone) => enumTag(milestone.status) === "Completed",
    ).length ?? 0;
  const milestoneCount = milestones.data?.length ?? 0;
  const progress =
    milestoneCount === 0 ? 0 : (completedMilestones / milestoneCount) * 100;
  const isMilestoneMutating =
    submitMilestone.isPending ||
    approveMilestone.isPending ||
    rejectMilestone.isPending ||
    completeMilestone.isPending;
  const isMutating =
    activate.isPending || pause.isPending || resume.isPending || isMilestoneMutating;
  const currentStatus = agreement.data ? enumTag(agreement.data.status) : null;
  const actionsDisabled = isMutating || !isConnected;
  const actionError =
    activate.error ??
    pause.error ??
    resume.error ??
    submitMilestone.error ??
    approveMilestone.error ??
    rejectMilestone.error ??
    completeMilestone.error;

  const donateToMilestone = (milestoneId: number, amount: string) => {
    if (!isConnected) {
      setDonationNotice("Connect Freighter before donating.");
      return;
    }

    if (!agreement.data?.grantee) {
      setDonationNotice("Agreement grantee not loaded yet.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setDonationNotice("Enter a donation amount greater than 0 XLM.");
      return;
    }

    donate.mutate(
      {
        to: agreement.data.grantee,
        amount,
        milestoneId,
      },
      {
        onError: (error) =>
          setDonationNotice(
            error instanceof Error ? error.message : "Donation failed.",
          ),
        onSuccess: (result) =>
          setDonationNotice(
            `Donated ${amount} XLM to Milestone #${milestoneId}. Tx: ${result.hash}`,
          ),
      },
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[280px] flex-col border-r border-outline bg-surface md:flex">
        <div className="border-b border-outline p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary shadow-[0_0_18px_rgba(137,206,255,0.25)]">
              <span className="text-lg font-bold">⬡</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-[-0.01em]">
                Aestrial Impact Protocol
              </h1>
              <p className="text-sm text-muted">Institutional Funding</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 py-4">
          <NavItem
            active={activeSection === "dashboard"}
            label="Dashboard"
            icon="▦"
            onSelect={() => setActiveSection("dashboard")}
          />
          <NavItem
            active={activeSection === "agreements"}
            label="Funding Agreements"
            icon="▤"
            onSelect={() => setActiveSection("agreements")}
          />
          <NavItem
            active={activeSection === "organizations"}
            label="Organizations"
            icon="▥"
            onSelect={() => setActiveSection("organizations")}
          />
          <NavItem
            active={activeSection === "disbursements"}
            label="Disbursements"
            icon="◍"
            onSelect={() => setActiveSection("disbursements")}
          />
          <NavItem label="Activity" icon="↺" />
        </nav>
        <div className="border-t border-outline p-4">
          <NavItem label="Settings" icon="⚙" />
        </div>
      </aside>

      <div className="min-h-screen md:ml-[280px]">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-outline bg-background/80 px-4 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-on-primary">
              ⬡
            </div>
            <span className="font-semibold">Aestrial Impact Protocol</span>
          </div>
          <div className="hidden w-72 md:block">
            <div className="rounded-lg border border-outline bg-surface-low px-4 py-2 font-mono text-sm text-muted">
              Search {sectionTitles[activeSection].toLowerCase()}...
            </div>
          </div>
          <ConnectWalletButton />
        </header>

        <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-6 md:px-6 xl:px-8">
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-sm tracking-[0.18em] text-primary">
                STELLAR AGREEMENTS
              </p>
              <h2 className="mt-2 text-4xl font-bold tracking-[-0.02em] md:text-5xl">
                {sectionTitles[activeSection]}
              </h2>
              <p className="mt-2 flex items-center gap-2 text-lg text-muted">
                Funding agreements powered by
                <span className="rounded border border-outline bg-surface-high px-2 py-0.5 font-mono text-sm text-foreground">
                  Stellar
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary">Export</Button>
            </div>
          </section>

          {activeSection === "dashboard" ? (
            <>
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="Current Status"
                  value={currentStatus ?? "Loading"}
                />
                <StatCard label="Milestones" value={String(milestoneCount)} />
                <StatCard
                  label="Completed"
                  value={String(completedMilestones)}
                />
                <StatCard label="Progress" value={`${Math.round(progress)}%`} />
              </section>

              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader
              title="Agreement"
              description={`Contract ${shortAddress(contractId)}`}
            />

            {agreement.isLoading ? (
              <p className="text-sm text-muted">Loading agreement...</p>
            ) : agreement.error ? (
              <p className="text-sm text-red-300">
                Could not load agreement. Check contract id and network.
              </p>
            ) : agreement.data ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={agreement.data.status} />
                  <span className="font-mono text-sm text-muted">
                    Metadata: {agreement.data.metadata_uri}
                  </span>
                </div>

                <div className="grid gap-3 text-sm md:grid-cols-2">
                  <Info label="Funder" value={shortAddress(agreement.data.funder)} />
                  <Info
                    label="Grantee"
                    value={shortAddress(agreement.data.grantee)}
                  />
                  <Info
                    label="Arbiter"
                    value={shortAddress(agreement.data.arbiter)}
                  />
                  <Info
                    label="Updated"
                    value={formatUnixTime(agreement.data.updated_at)}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    disabled={actionsDisabled || currentStatus !== "Draft"}
                    onClick={() => activate.mutate()}
                  >
                    Activate
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={actionsDisabled || currentStatus !== "Active"}
                    onClick={() => pause.mutate()}
                  >
                    Pause
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={actionsDisabled || currentStatus !== "Paused"}
                    onClick={() => resume.mutate()}
                  >
                    Resume
                  </Button>
                </div>
                {!isConnected ? (
                  <p className="text-sm text-amber-300">
                    Connect Freighter to send lifecycle transactions.
                  </p>
                ) : null}
                {actionError ? (
                  <p className="text-sm text-red-300">
                    {actionError instanceof Error
                      ? actionError.message
                      : "Transaction failed"}
                  </p>
                ) : null}
              </div>
            ) : null}
          </Card>

          <Card>
            <CardHeader
              title="Milestone Progress"
              description={`${completedMilestones} of ${milestoneCount} completed`}
            />
            <div className="space-y-3">
              <ProgressBar value={progress} />
              <p className="font-mono text-sm font-medium text-muted">
                {Math.round(progress)}%
              </p>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Milestones"
            description="Each milestone is loaded independently from contract storage. Donations send real XLM on testnet to the grantee."
          />
          {donationNotice ? (
            <div className="mb-4 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 font-mono text-sm text-primary">
              {donationNotice}
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            {milestones.data?.map((milestone) => (
              <div
                className="rounded-2xl border border-outline bg-surface-low p-4"
                key={milestone.id}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">Milestone #{milestone.id}</h3>
                  <StatusBadge status={milestone.status} />
                </div>
                <dl className="space-y-2 text-sm text-muted">
                  <Info label="Amount" value={formatAmount(milestone.amount)} />
                  <Info label="Metadata" value={milestone.metadata_uri} />
                  <Info
                    label="Completed"
                    value={formatUnixTime(milestone.completed_at)}
                  />
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    className="px-3 py-1.5"
                    disabled={
                      actionsDisabled ||
                      currentStatus !== "Active" ||
                      enumTag(milestone.status) !== "Pending"
                    }
                    onClick={() => submitMilestone.mutate(milestone.id)}
                  >
                    Submit
                  </Button>
                  <Button
                    className="px-3 py-1.5"
                    disabled={
                      actionsDisabled ||
                      currentStatus !== "Active" ||
                      enumTag(milestone.status) !== "Submitted"
                    }
                    onClick={() => approveMilestone.mutate(milestone.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    className="px-3 py-1.5"
                    variant="secondary"
                    disabled={
                      actionsDisabled ||
                      currentStatus !== "Active" ||
                      enumTag(milestone.status) !== "Submitted"
                    }
                    onClick={() => rejectMilestone.mutate(milestone.id)}
                  >
                    Reject
                  </Button>
                  <Button
                    className="px-3 py-1.5"
                    variant="secondary"
                    disabled={
                      actionsDisabled ||
                      currentStatus !== "Active" ||
                      enumTag(milestone.status) !== "Approved"
                    }
                    onClick={() => completeMilestone.mutate(milestone.id)}
                  >
                    Complete
                  </Button>
                </div>
                <div className="mt-4 rounded-xl border border-outline/60 bg-background/40 p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm text-primary">
                        Donate to milestone
                      </p>
                      <p className="text-xs text-muted">
                        Sends XLM on testnet to {shortAddress(agreement.data?.grantee)}.
                      </p>
                    </div>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 font-mono text-xs text-primary">
                      XLM
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["25", "50", "100"].map((amount) => (
                      <Button
                        className="px-3 py-1.5"
                        key={amount}
                        variant="ghost"
                        disabled={donate.isPending}
                        onClick={() => donateToMilestone(milestone.id, amount)}
                      >
                        {amount} XLM
                      </Button>
                    ))}
                    <input
                      className="w-24 rounded-lg border border-outline bg-background px-3 py-1.5 font-mono text-sm text-foreground outline-none ring-primary/30 focus:border-primary focus:ring-2"
                      inputMode="decimal"
                      onChange={(event) =>
                        setDonationAmountByMilestone((current) => ({
                          ...current,
                          [milestone.id]: event.target.value,
                        }))
                      }
                      placeholder="0.0"
                      value={donationAmountByMilestone[milestone.id] ?? ""}
                    />
                    <Button
                      className="px-3 py-1.5"
                      variant="secondary"
                      onClick={() =>
                        donateToMilestone(
                          milestone.id,
                          donationAmountByMilestone[milestone.id] ?? "0",
                        )
                      }
                      disabled={donate.isPending}
                    >
                      Donate
                    </Button>
                  </div>
                  {donate.isPending ? (
                    <p className="mt-3 text-xs text-muted">
                      Waiting for wallet signature and testnet confirmation...
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Card>
            </>
          ) : null}

          {activeSection === "agreements" ? (
            <AgreementIndexPanel
              agreements={indexedAgreements.data ?? []}
              isLoading={indexedAgreements.isLoading}
              loadError={indexedAgreements.error}
              onDeploy={(input) =>
                deployAgreement.mutate(input, {
                  onSuccess: (deployedAgreement) => {
                    setContractId(deployedAgreement.contractId);
                    setActiveSection("dashboard");
                  },
                })
              }
              deployError={deployAgreement.error}
              deployPending={deployAgreement.isPending}
              deploySuccess={deployAgreement.isSuccess}
              onSelectAgreement={(selectedContractId) => {
                setContractId(selectedContractId);
                setActiveSection("dashboard");
              }}
            />
          ) : null}

          {activeSection === "organizations" ? (
            <MockSection
              title="▥ Organizations"
              description="Mock registry of grant makers and beneficiaries."
              items={mockOrganizations.map((item) => ({
                title: item.name,
                subtitle: item.region,
                meta: item.verified ? "Verified" : "Pending review",
                status: item.verified ? "Approved" : "Submitted",
              }))}
            />
          ) : null}

          {activeSection === "disbursements" ? (
            <MockSection
              title="◍ Disbursements"
              description="Mock settlement queue for milestone releases."
              items={mockDisbursements.map((item) => ({
                title: item.id,
                subtitle: item.milestone,
                meta: item.amount,
                status: item.state,
              }))}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}

function MockSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: Array<{
    title: string;
    subtitle: string;
    meta: string;
    status: string;
  }>;
}) {
  return (
    <Card>
      <CardHeader title={title} description={description} />
      <div className="grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <MockRow
            key={item.title}
            title={item.title}
            subtitle={item.subtitle}
            meta={item.meta}
            status={item.status}
          />
        ))}
      </div>
    </Card>
  );
}

function AgreementIndexPanel({
  agreements,
  isLoading,
  loadError,
  onDeploy,
  deployError,
  deployPending,
  deploySuccess,
  onSelectAgreement,
}: {
  agreements: Array<CreateAgreementInput & { createdAt?: string }>;
  isLoading: boolean;
  loadError: unknown;
  onDeploy: (input: CreateAgreementInput) => void;
  deployError: unknown;
  deployPending: boolean;
  deploySuccess: boolean;
  onSelectAgreement: (contractId: string) => void;
}) {
  type AgreementSort = "newest" | "oldest" | "title" | "organization";

  const [sortBy, setSortBy] = useState<AgreementSort>("newest");
  const [form, setForm] = useState<CreateAgreementInput>({
    contractId: "",
    title: "",
    organization: "",
    metadataUri: "ipfs://agreement",
    funder: "",
    grantee: "",
    arbiter: "",
    network: "testnet",
    milestones: [{ id: 0, amount: "100", metadataUri: "ipfs://milestone-0" }],
  });

  const updateField = (field: keyof CreateAgreementInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateMilestone = (
    index: number,
    field: keyof IndexedMilestone,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      milestones: current.milestones.map((milestone, currentIndex) =>
        currentIndex === index
          ? {
              ...milestone,
              [field]: field === "id" ? Number(value) : value,
            }
          : milestone,
      ),
    }));
  };

  const addMilestone = () => {
    setForm((current) => ({
      ...current,
      milestones: [
        ...current.milestones,
        {
          id: current.milestones.length,
          amount: "100",
          metadataUri: `ipfs://milestone-${current.milestones.length}`,
        },
      ],
    }));
  };

  const removeMilestone = (index: number) => {
    setForm((current) => ({
      ...current,
      milestones: current.milestones.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onDeploy(form);
  };

  const sortedAgreements = useMemo(() => {
    const items = [...agreements];

    switch (sortBy) {
      case "oldest":
        return items.sort(
          (a, b) =>
            new Date(a.createdAt ?? 0).getTime() -
            new Date(b.createdAt ?? 0).getTime(),
        );
      case "title":
        return items.sort((a, b) => a.title.localeCompare(b.title));
      case "organization":
        return items.sort((a, b) =>
          a.organization.localeCompare(b.organization),
        );
      case "newest":
      default:
        return items.sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime(),
        );
    }
  }, [agreements, sortBy]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
      <Card>
        <CardHeader
          title="▤ Funding Agreements"
          description="MongoDB-backed index of deployed agreement contract IDs."
        />
        {isLoading ? <p className="text-sm text-muted">Loading index...</p> : null}
        {loadError ? (
          <div className="mb-4 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
            MongoDB index unavailable. Set `MONGODB_URI` and `MONGODB_DB` in
            your frontend environment.
          </div>
        ) : null}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
            {sortedAgreements.length} agreement
            {sortedAgreements.length === 1 ? "" : "s"}
          </p>
          <label className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
              Sort
            </span>
            <select
              className="rounded-lg border border-outline bg-background px-3 py-1.5 font-mono text-sm text-foreground outline-none ring-primary/30 focus:border-primary focus:ring-2"
              onChange={(event) =>
                setSortBy(event.target.value as AgreementSort)
              }
              value={sortBy}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title A–Z</option>
              <option value="organization">Organization A–Z</option>
            </select>
          </label>
        </div>
        <div className="space-y-3">
          {sortedAgreements.length > 0 ? (
            sortedAgreements.map((agreement) => (
              <MockRow
                key={agreement.contractId}
                title={agreement.title}
                subtitle={`${agreement.organization} · ${agreement.milestones.length} milestones`}
                meta={shortAddress(agreement.contractId)}
                status={agreement.network}
                onSelect={() => onSelectAgreement(agreement.contractId)}
              />
            ))
          ) : (
            <p className="rounded-xl border border-outline/60 bg-surface-low px-4 py-6 text-sm text-muted">
              No agreements indexed yet. Deploy one using the form on the right.
            </p>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Create New Agreement"
          description="Deploy, initialize, recover the contract id and index it in MongoDB."
        />
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid gap-3 md:grid-cols-2">
            <Field
              label="Title"
              onChange={(value) => updateField("title", value)}
              placeholder="Water Access Cohort"
              value={form.title}
            />
            <Field
              label="Organization"
              onChange={(value) => updateField("organization", value)}
              placeholder="Pulso Foundation"
              value={form.organization}
            />
            <Field
              label="Metadata URI"
              onChange={(value) => updateField("metadataUri", value)}
              placeholder="ipfs://agreement"
              value={form.metadataUri}
            />
            <Field
              label="Donation Receiver"
              onChange={(value) => updateField("grantee", value)}
              placeholder="Optional G... address, defaults to OWNER_ADDRESS"
              value={form.grantee}
            />
          </div>
          <p className="text-sm text-muted">
            Funder, arbiter and factory default to `OWNER_ADDRESS` from the root
            `.env`. The donation receiver becomes the on-chain grantee.
          </p>

          <div className="rounded-2xl border border-outline bg-surface-low p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Dynamic Milestones</h3>
              <Button type="button" variant="secondary" onClick={addMilestone}>
                Add Milestone
              </Button>
            </div>
            <div className="space-y-3">
              {form.milestones.map((milestone, index) => (
                <div className="grid gap-3 md:grid-cols-[80px_1fr_1fr_auto]" key={index}>
                  <Field
                    label="ID"
                    onChange={(value) => updateMilestone(index, "id", value)}
                    value={String(milestone.id)}
                  />
                  <Field
                    label="Amount"
                    onChange={(value) => updateMilestone(index, "amount", value)}
                    value={milestone.amount}
                  />
                  <Field
                    label="Metadata URI"
                    onChange={(value) =>
                      updateMilestone(index, "metadataUri", value)
                    }
                    value={milestone.metadataUri}
                  />
                  <Button
                    className="self-end"
                    disabled={form.milestones.length === 1}
                    type="button"
                    variant="ghost"
                    onClick={() => removeMilestone(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button disabled={deployPending} type="submit">
              {deployPending ? "Deploying..." : "Deploy + Initialize + Index"}
            </Button>
            {deploySuccess ? (
              <span className="font-mono text-sm text-primary">
                Agreement deployed, initialized and indexed.
              </span>
            ) : null}
            {deployError ? (
              <span className="text-sm text-red-300">
                {deployError instanceof Error
                  ? deployError.message
                  : "Unable to deploy agreement"}
              </span>
            ) : null}
          </div>
        </form>
      </Card>
    </div>
  );
}

function MockRow({
  title,
  subtitle,
  meta,
  status,
  onSelect,
}: {
  title: string;
  subtitle: string;
  meta: string;
  status: string;
  onSelect?: () => void;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <p className="mt-3 font-mono text-sm text-primary">{meta}</p>
    </>
  );

  if (onSelect) {
    return (
      <button
        className="w-full rounded-xl border border-outline/60 bg-surface-low p-4 text-left transition hover:border-primary/50"
        type="button"
        onClick={onSelect}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-outline/60 bg-surface-low p-4 transition hover:border-primary/50">
      {content}
    </div>
  );
}

function NavItem({
  label,
  icon,
  active = false,
  onSelect,
}: {
  label: string;
  icon: string;
  active?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center gap-3 border-l-4 px-4 py-2 transition ${
        active
          ? "border-primary bg-surface-highest text-primary"
          : "border-transparent text-muted hover:border-outline hover:bg-surface-high"
      }`}
    >
      <span className="font-mono text-lg">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel subtle-gradient rounded-2xl p-5 transition hover:border-primary/60">
      <p className="font-mono text-sm tracking-[0.02em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-[-0.02em] text-foreground">
        {value}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-xs uppercase tracking-[0.08em] text-muted">
        {label}
      </span>
      <input
        className="w-full rounded-lg border border-outline bg-background px-3 py-2 font-mono text-sm text-foreground outline-none ring-primary/30 transition placeholder:text-muted/50 focus:border-primary focus:ring-2"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 rounded-xl border border-outline/60 bg-surface-low px-3 py-2">
      <dt className="text-muted">{label}</dt>
      <dd className="truncate text-right font-mono text-sm font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}
