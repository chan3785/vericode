"use client";
import { RecoilRoot } from "recoil";
import { Button } from "../ui/button";
import { Wallet } from "../ui/wallet";
import { useRouter } from "next/navigation";
import { Account } from "./account";

export default function Header() {
  const router = useRouter();
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="ml-20 mr-20 flex h-20 items-center justify-between px-4">
        <div>
          <Button
            className="w-30 ml-7 h-8 font-semibold"
            variant="ghost"
            onClick={() => {
              router.push("/");
            }}
          >
            VeriCode
          </Button>

          <Button
            className="w-30 ml-7 h-8 bg-blue-400 font-semibold"
            onClick={() => {
              router.push("/");
            }}
          >
            coding test
          </Button>
        </div>
        <div>
          <Account />
        </div>
      </nav>
    </div>
  );
}
