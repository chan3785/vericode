"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeMirrorEditor from "./codemirror";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useCallback } from "react";

export function ResizableScreen() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w-md rounded-lg border md:min-w-full h-full"
    >
      <ResizablePanel defaultSize={40}>
        <ScrollArea className="h-full rounded-md">
          <div
            className={`"flex min-h-[705px] items-center justify-center p-6"`}
          >
            <div className="p-6">
              <span className="font-semibold text-white">
                <p>Problem Description</p> <br />
                <p>You are given two integers, 𝐴 and 𝐵 . </p> <br />
                <p>Write a program that calculates and prints their sum.</p>
                Input Format The first line contains two integers,
                <br /> 𝐴 and 𝐵, separated by a space.
                <br /> − 10^9 ≤ 𝐴 , 𝐵 ≤ 10^9 <br /> −10^9 ≤ 𝐴,𝐵≤10^9 <br />
                <br />
                Output Format Print the sum of 𝐴 and 𝐵. <br />
                <br /> Example Input & Output <br />
                <br /> Example 1<br />
                <br /> Input: <br />
                <br /> 3 5<br />
                <br /> 8<br /> <br /> Example 2<br />
                <br /> Input: <br />
                <br /> -10 4<br />
                <br /> -6
                <br />
                <br /> Example 3<br />
                <br /> Input: <br />
                <br /> 1000000000 1000000000
                <br />
                <br /> 2000000000
                <br />
              </span>
            </div>
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={80}>
            <ScrollArea className="h-full whitespace-nowrap rounded-md">
              <div className="flex w-full items-center justify-center p-6">
                <CodeMirrorEditor />
              </div>
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20}>
            <div className="flex h-full text-start p-6">
              <span className="font-semibold text-white">
                sum of a, b: 2000000000
              </span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
