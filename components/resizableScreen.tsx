"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeMirrorEditor from "./codemirror";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export function ResizableScreen() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w-md rounded-lg border md:min-w-full h-full"
    >
      <ResizablePanel defaultSize={40}>
        <ScrollArea className="h-full rounded-md border">
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
                Output Format Print the sum of 𝐴 and 𝐵.
              </span>
            </div>
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70}>
            <ScrollArea className="h-full whitespace-nowrap rounded-md border">
              <div className="flex w-full items-center justify-center p-6">
                <CodeMirrorEditor />
              </div>
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
