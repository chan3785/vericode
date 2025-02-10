"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import { Button } from "../ui/button";
import { ellipsisAddress } from "@/utils/strings";
import { useRouter } from "next/navigation";

export const Account = () => {
  const account = useAccount();
  const router = useRouter();

  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  return (
    <div className="flex items-center space-x-2">
      <h3>
        {account.status === "connected" ? (
          <Button
            onClick={() => disconnect()}
            className="w-[120px] rounded-lg bg-indigo-950"
          >
            <h3 className="text-md mr-2">{ellipsisAddress(account.address)}</h3>
          </Button>
        ) : (
          connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => {
                connect({ connector });
                router.push("/zkproof");
              }}
              className="bg-indigo-950"
            >
              Connect
            </Button>
          ))
        )}
      </h3>
    </div>
  );
};
