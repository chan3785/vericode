"use client";
import { LanguageSelect } from "@/components/languageSelect";
import { ResizableScreen } from "@/components/resizableScreen";
import { LangContext } from "@/context/langContext";
import { Dispatch, SetStateAction, useState } from "react";

export default function Home() {
  const [lang, setLang] = useState("javascript");

  const contextValue = {
    lang,
    setLang: setLang,
  };

  return (
    <main className="p-10 mt-16  bg-indigo-950">
      <LangContext.Provider value={contextValue}>
        <div className="justify-between flex mb-2 ">
          <span className="text-2xl font-bold text-white">
            problem 18 / CPMM
          </span>
          <LanguageSelect />
        </div>
        <ResizableScreen />
      </LangContext.Provider>
    </main>
  );
}
