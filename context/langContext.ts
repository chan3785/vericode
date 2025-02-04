// context/UserContext.js
import { createContext, Dispatch, SetStateAction } from "react";

interface LangContextType {
    lang: string;
    setLang: Dispatch<SetStateAction<string>>;
  }
  
export const LangContext = createContext<LangContextType>({
    lang: "en",
    setLang: () => {}, // 기본값으로 빈 함수 제공
  });
