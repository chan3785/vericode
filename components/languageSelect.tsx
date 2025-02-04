"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LangContext } from "@/context/langContext";

const language = [
  {
    label: "Javascript",
  },
  {
    label: "Cpp",
  },
];

export const LanguageSelect = () => {
  const { lang, setLang } = React.useContext(LangContext);
  const handleSelect = (value: "string") => {
    if (value) {
      setLang(value);
      console.log(value);
    }
  };

  return (
    <Select onValueChange={handleSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {language.map((lang) => (
            <SelectItem key={lang.label} value={lang.label}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
