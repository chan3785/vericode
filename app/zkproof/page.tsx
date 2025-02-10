"use client";

import React, { useState } from "react";
import * as snarkjs from "snarkjs";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { BigNumber } from "bignumber.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ZkProofPage = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState("🟢 준비됨");
  const [proofData, setProofData] = useState<string | null>(null);
  const [publicData, setPublicData] = useState<string | null>(null);
  const [extractedProof, setExtractedProof] = useState<string | null>(null);

  // ✅ Proof 생성
  const handleGenerateProof = async () => {
    setStatus("🚀 Generating Proof...");
    try {
      const witnessPath = "/proof/witness.wtns";
      const zkeyPath = "/proof/circuit.zkey";
      const { proof, publicSignals } = await snarkjs.fflonk.prove(zkeyPath, witnessPath);

      setProofData(JSON.stringify(proof, null, 2));
      setPublicData(JSON.stringify(publicSignals, null, 2));

      const proofString = proof.proof;
      setExtractedProof(proofString);

      toast({ title: "✅ Proof Generated", description: "Proof and Public Signals are available for download." });
      setStatus("✅ Proof Generated! Ready for submission");
    } catch (error) {
      console.error("🚨 Error generating proof:", error);
      setStatus("🚨 Error generating proof");
      toast({ title: "❌ Proof Generation Failed", description: "An error occurred." });
    }
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // ✅ Submit Proof
  const handleSubmitProof = async () => {
    setStatus("🚀 Submitting Proof...");
    try {
      const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET;
      const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
  
      if (!websocketUrl || !privateKey) {
        throw new Error("❌ Missing environment variables (NEXT_PUBLIC_WEBSOCKET or NEXT_PUBLIC_PRIVATE_KEY)");
      }
  
      console.log("🔍 WebSocket URL:", websocketUrl);
      console.log("🔍 Private Key:", privateKey);
  
      const provider = new WsProvider(websocketUrl);
      const api = await ApiPromise.create({ provider });
      console.log("✅ Blockchain API Connected");
  
      const keyring = new Keyring({ type: "sr25519" });
  
      console.log("📂 Fetching verification_key.json...");
      const verificationKeyRes = await fetch("/proof/verification_key.json");
      console.log("📂 Fetching fflonk_proof.json...");
      const proofRes = await fetch("/proof/fflonk_proof.json");
      console.log("📂 Fetching public.json...");
      const publicRes = await fetch("/proof/public.json");
  
      if (!verificationKeyRes.ok || !proofRes.ok || !publicRes.ok) {
        throw new Error("🚨 Failed to load JSON files!");
      }
  
      console.log("✅ All JSON files loaded successfully");
  
      const proofJson = await proofRes.json();
      const extractedProof = proofJson.proof;
      console.log("🔍 Extracted Proof:", extractedProof);
      
      const vk = await verificationKeyRes.json();
      console.log("🔍 Verification Key:", vk);
      
      const pub = await publicRes.json();
      console.log("🔍 Public Signals (Raw):", pub);
      console.log("0x" + BigNumber(pub).toString(16).padStart(64, '0'));
  
      const formattedVk = {
        ...vk,
        get x2() {
          return this.X_2;
        },
        get c0() {
          return this.C0;
        },
      };
      console.log("🔍 Formatted Verification Key:", formattedVk);
  
      const account = keyring.addFromUri(privateKey);
      console.log("✅ Keyring account loaded");
  
      console.log("📩 Preparing Proof submission...");
      const submit = api.tx.settlementFFlonkPallet.submitProof(
        { Vk: formattedVk },
        extractedProof,
        "0x" + BigNumber(pub).toString(16).padStart(64, '0'),
        null
      );



      console.log("🚀 Executing Proof submission...");
      await submit.signAndSend(account, ({ txHash, status, dispatchError }) => {
        if (status.isReady) {
          console.log("📩 Proof submitted with hash:", txHash.toHex());
          setStatus(`📩 Proof Submitted (TxHash: ${txHash.toHex()})`);
          toast({ 
            title: "✅ Proof Submitted", 
            description: `TxHash: ${txHash.toHex()}` 
          });
        } else if (status.isInBlock) {
          if (!dispatchError) {
            console.log("🎉 Proof Verified Successfully!");
            
            // ✅ setStatus에 HTML 링크 적용
            setStatus(
              `🎉 Proof Verified Successfully!<br />
              Check your submission here: 
              <a href="https://zkverify-explorer.zkverify.io/extrinsics/${txHash.toHex()}" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline;">
                zkverify-explorer
              </a>`
            );
            
            
      
            // ✅ toast에서 클릭 가능한 링크 적용
            toast({ 
              title: "🎉 Proof Verified Successfully!",
              description: (
                <span>
                  Check your submission here:{" "}
                  <a 
                    href={`https://zkverify-explorer.zkverify.io/${txHash.toHex()}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    zkverify-explorer
                  </a>
                </span>
              )
            });
      
          } else {
            console.error("❌ Proof Verification Failed:", dispatchError.toString());
            setStatus("❌ Proof Verification Failed");
            toast({ 
              title: "❌ Proof Verification Failed", 
              description: dispatchError.toString() 
            });
          }
        }
      });
      
      
  
    } catch (error: any) {
      console.error("🚨 Error submitting proof:", error);
      setStatus("🚨 Error submitting proof");
      toast({ title: "❌ Proof Submission Failed", description: error.toString() });
    }
  };

  

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row p-6 space-y-6 lg:space-y-0 lg:space-x-6 mt-16">
      
      {/* Left Panel (Proof Generation & Submission) */}
      <div className="w-full lg:w-2/5 flex flex-col gap-4">
        
        {/* Proof Generation */}
        <Card className="shadow-lg flex-1 flex flex-col justify-center">
          <CardHeader>
            <CardTitle>📌 Step 1: Generate Proof</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <Button onClick={handleGenerateProof} className="bg-blue-600 text-white w-full text-lg py-3">
              🔄 Generate Proof
            </Button>
            <div className="grid grid-cols-2 gap-2 mt-4 w-full">
              <Button onClick={() => downloadFile("proof.json", proofData || "{}")} className="bg-gray-700 text-white w-full">
                ⬇ Proof.json
              </Button>
              <Button onClick={() => downloadFile("public.json", publicData || "{}")} className="bg-gray-700 text-white w-full">
                ⬇ Public.json
              </Button>
            </div>
          </CardContent>
        </Card>
  
        {/* Proof Submission */}
        <Card className="shadow-lg flex-1 flex flex-col justify-center">
          <CardHeader>
            <CardTitle>📌 Step 2: Submit Proof</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center mt-10 mb-5">
            <Button
              onClick={handleSubmitProof}
              className="bg-green-600 text-white w-full text-lg py-3"
              disabled={!proofData || !publicData}
            >
              🚀 Submit Proof
            </Button>
          </CardContent>
        </Card>
  
        {/* Current Status */}
        <Card className="shadow-lg flex-1 flex flex-col justify-center">
          <CardHeader>
            <CardTitle>📢 Current Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center mt-10 mb-5">
            <p className="text-gray-500 text-center" dangerouslySetInnerHTML={{ __html: status }} />
          </CardContent>
        </Card>
  
      </div>
  
      {/* Right Panel (Output) */}
      <div className="w-full lg:w-3/5 flex flex-col gap-4">
        
        {/* Generated Proof */}
        <Card className="shadow-lg flex-[2] flex flex-col justify-center">
          <CardHeader>
            <CardTitle>📜 Generated Proof</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {proofData ? (
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[300px] w-full">{proofData}</pre>
            ) : (
              <p className="text-gray-400 italic text-center">Proof will be displayed here once generated.</p>
            )}
          </CardContent>
        </Card>
  
        {/* Public Signals */}
        <Card className="shadow-lg flex-1 flex flex-col justify-center">
          <CardHeader>
            <CardTitle>📊 Public.json</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {publicData ? (
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[140px] w-full">{publicData}</pre>
            ) : (
              <p className="text-gray-400 italic text-center">Public.json will be displayed here once generated.</p>
            )}
          </CardContent>
        </Card>
  
      </div>
  
    </div>
  );
};

export default ZkProofPage;
