"use client";

import { useFarcasterContext } from "@/hooks/use-farcaster-context";
import { useAccount } from "wagmi";
import WalletAnalyzer from "../WalletAnalyzer";

export default function Home() {
  const { isInFarcaster, isLoading, userInfo } = useFarcasterContext();
  const { address } = useAccount();

  // Always show the WalletAnalyzer component
  return <WalletAnalyzer />;
}
