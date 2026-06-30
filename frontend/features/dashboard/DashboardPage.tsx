"use client";

import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAgreement } from "@/hooks/useAgreement";
import { useWallet } from "@/hooks/useWallet";
import {
  enumTag,
  formatAmount,
  formatUnixTime,
  shortAddress,
} from "@/utils/format";

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
  } = useAgreement();
  const { isConnected } = useWallet();

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
                Impact Protocol
              </h1>
              <p className="text-sm text-muted">Institutional Funding</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 py-4">
          <NavItem active label="Dashboard" icon="▦" />
          <NavItem label="Funding Agreements" icon="▤" />
          <NavItem label="Organizations" icon="▥" />
          <NavItem label="Disbursements" icon="◍" />
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
            <span className="font-semibold">Impact Protocol</span>
          </div>
          <div className="hidden w-72 md:block">
            <div className="rounded-lg border border-outline bg-surface-low px-4 py-2 font-mono text-sm text-muted">
              Search agreements...
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
                Dashboard
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

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Current Status" value={currentStatus ?? "Loading"} />
            <StatCard label="Milestones" value={String(milestoneCount)} />
            <StatCard label="Completed" value={String(completedMilestones)} />
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
            description="Each milestone is loaded independently from contract storage."
          />
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
              </div>
            ))}
          </div>
        </Card>
        </main>
      </div>
    </div>
  );
}

function NavItem({
  label,
  icon,
  active = false,
}: {
  label: string;
  icon: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 border-l-4 px-4 py-2 transition ${
        active
          ? "border-primary bg-surface-highest text-primary"
          : "border-transparent text-muted hover:border-outline hover:bg-surface-high"
      }`}
    >
      <span className="font-mono text-lg">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
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
