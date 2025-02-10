"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  wagmiContractConfigArb,
  wagmiContractConfigEdu,
} from "@/lib/contracts";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useWriteContract } from "wagmi";
import { useAccount } from "wagmi";

const problems = [
  { id: 1, state: "✅", name: "Addition Operation", level: 1, rate: "98%" },
];

export default function MainPage() {
  const { writeContract } = useWriteContract();
  const account = useAccount().address?.toString();
  if (!account) {
    return;
  }
  const address = ethers.getAddress(account);
  const handleMintEdu = () => {
    writeContract({
      ...wagmiContractConfigEdu,
      functionName: "safeMint",
      args: [address, `${problems[0].name}`],
    });
  };
  const handleMintArb = () => {
    writeContract({
      ...wagmiContractConfigArb,
      functionName: "safeMint",
      args: [address, `${problems[0].name}`],
    });
  };

  return (
    <main className="flex min-h-screen items-start justify-center bg-indigo-950 p-10 pt-20">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 h-[60vh] overflow-y-auto mt-10">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>State</TableHead>
              <TableHead className="w-[400px] justify-center flex items-center text-center">
                Problem Name
              </TableHead>
              <TableHead className="text-center">LV</TableHead>
              <TableHead className="justify-items-center text-center">
                Correct Rate
              </TableHead>
              <TableHead className="justify-items-center text-center">
                Mint
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems?.map((problem) => (
              <TableRow key={problem.id} className="text-center">
                <TableCell className="font-medium text-center">
                  {problem.state ?? ""}
                </TableCell>
                <TableCell className="font-medium text-start">
                  {problem.name}
                </TableCell>
                <TableCell className="text-center">{problem.level}</TableCell>
                <TableCell className="text-center">{problem.rate}</TableCell>
                <TableCell className="text-center">
                  <Button className="h-[20px] mb-1" onClick={handleMintEdu}>
                    Mint (Edu)
                  </Button>
                  <Button className="h-[20px]" onClick={handleMintArb}>
                    Mint (Arb)
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                {problems?.length === 0 ? "No problems available." : ""}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </main>
  );
}
