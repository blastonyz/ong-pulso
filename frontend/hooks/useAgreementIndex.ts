"use client";

import { AgreementIndexService } from "@/services/AgreementIndexService";
import type { CreateAgreementInput } from "@/types/agreement";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

const agreementIndexKey = ["agreement-index"] as const;

export function useAgreementIndex() {
  const queryClient = useQueryClient();
  const service = useMemo(() => new AgreementIndexService(), []);

  const agreements = useQuery({
    queryKey: agreementIndexKey,
    queryFn: () => service.list(),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 10_000,
  });

  const deployAgreement = useMutation({
    mutationFn: (input: CreateAgreementInput) => service.deploy(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: agreementIndexKey }),
  });

  return { agreements, deployAgreement };
}
