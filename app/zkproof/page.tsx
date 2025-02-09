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
    setStatus("🚀 Proof 생성 중...");
    try {
      const witnessPath = "/proof/witness.wtns";
      const zkeyPath = "/proof/circuit.zkey";
      const { proof, publicSignals } = await snarkjs.fflonk.prove(zkeyPath, witnessPath);

      setProofData(JSON.stringify(proof, null, 2));
      setPublicData(JSON.stringify(publicSignals, null, 2));

      const proofString = proof.proof;
      setExtractedProof(proofString);

      toast({ title: "✅ Proof 생성 완료", description: "Proof 및 Public Signals을 다운로드할 수 있습니다." });
      setStatus("✅ Proof 생성 완료! 다운로드 후 제출 가능");
    } catch (error) {
      console.error("🚨 Proof 생성 중 오류 발생:", error);
      setStatus("🚨 Proof 생성 중 오류 발생");
      toast({ title: "❌ Proof 생성 실패", description: "오류가 발생했습니다." });
    }
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // ✅ Proof 제출
  const handleSubmitProof = async () => {
    setStatus("🚀 Proof 제출 중...");
    try {
      const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET;
      const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
  
      if (!websocketUrl || !privateKey) {
        throw new Error("❌ 환경변수(NEXT_PUBLIC_WEBSOCKET 또는 NEXT_PUBLIC_PRIVATE_KEY)가 설정되지 않음");
      }
  
      console.log("🔍 WebSocket 연결 URL:", websocketUrl);
      console.log("🔍 Private Key:", privateKey);
  
      const provider = new WsProvider(websocketUrl);
      const api = await ApiPromise.create({ provider });
      console.log("✅ 블록체인 API 연결 성공");
  
      const keyring = new Keyring({ type: "sr25519" });
  
      console.log("📂 Fetching verification_key.json...");
      const verificationKeyRes = await fetch("/proof/verification_key.json");
      console.log("📂 Fetching fflonk_proof.json...");
      const proofRes = await fetch("/proof/fflonk_proof.json");
      console.log("📂 Fetching public.json...");
      const publicRes = await fetch("/proof/public.json");
  
      if (!verificationKeyRes.ok || !proofRes.ok || !publicRes.ok) {
        throw new Error("🚨 JSON 파일 로드 실패!");
      }
  
      console.log("✅ 모든 JSON 파일 로드 성공");
  
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
      console.log("✅ Keyring account 로드 완료");
  
      console.log("📩 Proof 제출 준비...");
      const submit = api.tx.settlementFFlonkPallet.submitProof(
        { Vk: formattedVk },
        extractedProof,
        "0x" + BigNumber(pub).toString(16).padStart(64, '0'),
        null
      );
  
      console.log("🚀 Proof 제출 실행 중...");
      await submit.signAndSend(account, ({ txHash, status, dispatchError }) => {
        if (status.isReady) {
          console.log("📩 Proof submitted with hash:", txHash.toHex());
          setStatus(`📩 Proof 제출됨 (TxHash: ${txHash.toHex()})`);
          toast({ title: "✅ Proof 제출 완료", description: `TxHash: ${txHash.toHex()}` });
        } else if (status.isInBlock) {
          if (!dispatchError) {
            console.log("🎉 Proof 검증 성공!");
            setStatus("🎉 Proof 검증 성공!");
            toast({ title: "🎉 Proof 검증 성공", description: "트랜잭션이 블록에 포함되었습니다." });
          } else {
            console.error("❌ Proof 검증 실패:", dispatchError.toString());
            setStatus("❌ Proof 검증 실패");
            toast({ title: "❌ Proof 검증 실패", description: dispatchError.toString() });
          }
        }
      });
  
    } catch (error: any) {
      console.error("🚨 Proof 제출 중 오류 발생:", error);
      setStatus("🚨 Proof 제출 중 오류 발생");
      toast({ title: "❌ Proof 제출 실패", description: error.toString() });
    }
  };
  

  return (
    <div className="container mx-auto p-6 flex space-x-6 mt-16">
      
      {/* 왼쪽 패널 (Proof 생성 및 제출) */}
      <div className="w-2/5 space-y-6">
        
        {/* Proof 생성 */}
        <Card className="shadow-lg h-[220px]">
          <CardHeader>
            <CardTitle>📌 Step 1: Proof 생성</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerateProof} className="bg-blue-600 text-white w-full text-lg py-3">
              🔄 Proof 생성하기
            </Button>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button onClick={() => downloadFile("proof.json", proofData || "{}")} className="bg-gray-700 text-white">
                ⬇ Proof.json
              </Button>
              <Button onClick={() => downloadFile("public.json", publicData || "{}")} className="bg-gray-700 text-white">
                ⬇ Public.json
              </Button>
            </div>
          </CardContent>
        </Card>
  
        {/* Proof 제출 */}
        <Card className="shadow-lg h-[155px]">
          <CardHeader>
            <CardTitle>📌 Step 2: Proof 제출</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleSubmitProof}
              className="bg-green-600 text-white w-full text-lg py-3"
              disabled={!proofData || !publicData}
            >
              🚀 Proof 제출하기
            </Button>
          </CardContent>
        </Card>
  
        {/* 현재 상태 */}
        <Card className="shadow-lg h-[140px]">
          <CardHeader>
            <CardTitle>📢 현재 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">{status}</p>
          </CardContent>
        </Card>
  
      </div>
  
      {/* 오른쪽 패널 (출력) */}
      <div className="w-3/5 space-y-6">
        
        {/* 생성된 Proof */}
        <Card className="shadow-lg h-[340px]">
          <CardHeader>
            <CardTitle>📜 생성된 Proof</CardTitle>
          </CardHeader>
          <CardContent>
            {proofData ? (
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[240px]">{proofData}</pre>
            ) : (
              <p className="text-gray-400 italic">Proof가 생성되면 여기에 표시됩니다.</p>
            )}
          </CardContent>
        </Card>
  
        {/* Public Signals */}
        <Card className="shadow-lg h-[200px]">
          <CardHeader>
            <CardTitle>📊 Public Signals</CardTitle>
          </CardHeader>
          <CardContent>
            {publicData ? (
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[140px]">{publicData}</pre>
            ) : (
              <p className="text-gray-400 italic">Public Signals가 생성되면 여기에 표시됩니다.</p>
            )}
          </CardContent>
        </Card>
  
      </div>
  
    </div>
  );
  
};

export default ZkProofPage;
