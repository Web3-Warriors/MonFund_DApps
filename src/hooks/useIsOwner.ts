import { useAccount, useReadContract } from "wagmi";
import {
  CROWDFUNDING_CONTRACT_ADDRESS,
  CROWDFUNDING_ABI,
} from "@/config/contract";

export const useIsOwner = () => {
  const { address, isConnected } = useAccount();

  const { data: ownerAddress, isLoading } = useReadContract({
    address: CROWDFUNDING_CONTRACT_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "owner",
  });

  const isOwner =
    isConnected &&
    address &&
    ownerAddress &&
    address.toLowerCase() === (ownerAddress as string).toLowerCase();

  return {
    isOwner: !!isOwner,
    isLoading,
    ownerAddress: ownerAddress as string,
  };
};
