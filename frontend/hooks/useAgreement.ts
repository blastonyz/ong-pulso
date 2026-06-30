"use client";

import { FundingAgreementService } from "@/services/FundingAgreementService";
import { useSorobanContext } from "@/providers/SorobanProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

const agreementKeys = {
  agreement: (contractId: string) =>
    ["funding-agreement", contractId, "agreement"] as const,
  milestones: (contractId: string) =>
    ["funding-agreement", contractId, "milestones"] as const,
};

export function useAgreement() {
  const {
    fundingAgreement,
    fundingAgreementContractId,
    setFundingAgreementContractId,
  } = useSorobanContext();
  const queryClient = useQueryClient();
  const service = useMemo(
    () => new FundingAgreementService(fundingAgreement),
    [fundingAgreement],
  );

  const liveQueryOptions = {
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always" as const,
    refetchOnWindowFocus: true,
    refetchInterval: 5_000,
  };

  const agreement = useQuery({
    queryKey: agreementKeys.agreement(fundingAgreementContractId),
    queryFn: () => service.getAgreement(),
    ...liveQueryOptions,
  });

  const milestones = useQuery({
    queryKey: agreementKeys.milestones(fundingAgreementContractId),
    queryFn: () => service.getMilestones(),
    ...liveQueryOptions,
  });

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: agreementKeys.agreement(fundingAgreementContractId),
      }),
      queryClient.invalidateQueries({
        queryKey: agreementKeys.milestones(fundingAgreementContractId),
      }),
    ]);
  };

  const activate = useMutation({
    mutationFn: () => service.activate(),
    onSuccess: invalidate,
  });

  const pause = useMutation({
    mutationFn: () => service.pause(),
    onSuccess: invalidate,
  });

  const resume = useMutation({
    mutationFn: () => service.resume(),
    onSuccess: invalidate,
  });

  const submitMilestone = useMutation({
    mutationFn: (id: number) => service.submitMilestone(id),
    onSuccess: invalidate,
  });

  const approveMilestone = useMutation({
    mutationFn: (id: number) => service.approveMilestone(id),
    onSuccess: invalidate,
  });

  const rejectMilestone = useMutation({
    mutationFn: (id: number) => service.rejectMilestone(id),
    onSuccess: invalidate,
  });

  const completeMilestone = useMutation({
    mutationFn: (id: number) => service.completeMilestone(id),
    onSuccess: invalidate,
  });

  return {
    contractId: fundingAgreementContractId,
    setContractId: setFundingAgreementContractId,
    agreement,
    milestones,
    activate,
    pause,
    resume,
    submitMilestone,
    approveMilestone,
    rejectMilestone,
    completeMilestone,
  };
}
