"use client";

import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAgreement } from "@/hooks/useAgreement";
import { enumTag, formatAmount, formatUnixTime, shortAddress } from "@/utils/format";

export function DashboardPage() {
  const { contractId, agreement, milestones, activate, pause, resume } =
    useAgreement();

  const completedMilestones =
    milestones.data?.filter(
      (milestone) => enumTag(milestone.status) === "Completed",
    ).length ?? 0;
  const milestoneCount = milestones.data?.length ?? 0;
  const progress =
    milestoneCount === 0 ? 0 : (completedMilestones / milestoneCount) * 100;
  const isMutating = activate.isPending || pause.isPending || resume.isPending;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 rounded-3xl bg-slate-950 p-8 text-white md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
              Impact Protocol
            </p>
            <h1 className="mt-3 text-3xl font-semibold">
              Funding Agreement Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Agreement state, participants and milestone progress through the
              generated Soroban bindings.
            </p>
          </div>
          <ConnectWalletButton />
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader
              title="Agreement"
              description={`Contract ${shortAddress(contractId)}`}
            />

            {agreement.isLoading ? (
              <p className="text-sm text-slate-500">Loading agreement...</p>
            ) : agreement.error ? (
              <p className="text-sm text-red-600">
                Could not load agreement. Check contract id and network.
              </p>
            ) : agreement.data ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={agreement.data.status} />
                  <span className="text-sm text-slate-500">
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
                    disabled={isMutating}
                    onClick={() => activate.mutate()}
                  >
                    Activate
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={isMutating}
                    onClick={() => pause.mutate()}
                  >
                    Pause
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={isMutating}
                    onClick={() => resume.mutate()}
                  >
                    Resume
                  </Button>
                </div>
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
              <p className="text-sm font-medium text-slate-700">
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
                className="rounded-2xl border border-slate-200 p-4"
                key={milestone.id}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">Milestone #{milestone.id}</h3>
                  <StatusBadge status={milestone.status} />
                </div>
                <dl className="space-y-2 text-sm text-slate-600">
                  <Info label="Amount" value={formatAmount(milestone.amount)} />
                  <Info label="Metadata" value={milestone.metadata_uri} />
                  <Info
                    label="Completed"
                    value={formatUnixTime(milestone.completed_at)}
                  />
                </dl>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="truncate text-right font-medium text-slate-800">{value}</dd>
    </div>
  );
}
