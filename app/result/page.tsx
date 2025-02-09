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
import { wagmiContractConfigEdu } from "@/lib/contracts";
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
  const handleMint = () => {
    writeContract({
      ...wagmiContractConfigEdu,
      functionName: "safeMint",
      args: [address, `${problems[0].name}`],
    });
    console.log(address, typeof address);
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
              <TableRow key={problem.id}>
                <TableCell className="font-medium text-center">
                  {problem.state ?? ""}
                </TableCell>
                <TableCell className="font-medium items-center flex text-center">
                  {problem.name}
                </TableCell>
                <TableCell className="text-center">{problem.level}</TableCell>
                <TableCell className="text-center">{problem.rate}</TableCell>
                <TableCell className="text-center">
                  <Button className="h-[20px]" onClick={handleMint}>
                    Mint
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
