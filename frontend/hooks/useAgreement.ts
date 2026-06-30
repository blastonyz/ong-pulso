"use client";

import { FundingAgreementService } from "@/services/FundingAgreementService";
import { useSorobanContext } from "@/providers/SorobanProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

const agreementKeys = {
  agreement: ["funding-agreement", "agreement"] as const,
  milestones: ["funding-agreement", "milestones"] as const,
};

export function useAgreement() {
  const { fundingAgreement, fundingAgreementContractId } = useSorobanContext();
  const queryClient = useQueryClient();
  const service = useMemo(
    () => new FundingAgreementService(fundingAgreement),
    [fundingAgreement],
  );

  const agreement = useQuery({
    queryKey: agreementKeys.agreement,
    queryFn: () => service.getAgreement(),
  });

  const milestones = useQuery({
    queryKey: agreementKeys.milestones,
    queryFn: () => service.getMilestones(),
  });

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: agreementKeys.agreement }),
      queryClient.invalidateQueries({ queryKey: agreementKeys.milestones }),
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
