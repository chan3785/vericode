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
                Jokester began sneaking into the castle in the middle of the
                night and leaving jokes all over the place: under the king's
                pillow, in his soup, even in the royal toilet. The king was
                furious, but he couldn't seem to stop Jokester. And then, one
                day, the people of the kingdom discovered that the jokes left by
                Jokester were so funny that they couldn't help but laugh. And
                once they started laughing, they couldn't stop.
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
