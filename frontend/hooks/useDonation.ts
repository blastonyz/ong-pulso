"use client";

import { DonationService } from "@/services/DonationService";
import { useWallet } from "@/hooks/useWallet";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

export function useDonation() {
  const { address, sign } = useWallet();
  const service = useMemo(() => new DonationService(), []);

  const donate = useMutation({
    mutationFn: ({
      to,
      amount,
      milestoneId,
    }: {
      to: string;
      amount: string;
      milestoneId: number;
    }) => {
      if (!address) throw new Error("Connect Freighter before donating");
      return service.donateXlm({ from: address, to, amount, milestoneId, sign });
    },
  });

  return { donate };
}
