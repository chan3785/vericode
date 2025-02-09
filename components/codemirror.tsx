"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Compartment, EditorState, Extension } from "@codemirror/state";
import { EditorView, basicSetup, minimalSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { language, LanguageSupport } from "@codemirror/language";
import { cpp } from "@codemirror/lang-cpp";
import { LangContext } from "@/context/langContext";
import { syntaxTree } from "@codemirror/language";
import { linter, Diagnostic } from "@codemirror/lint";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
type CodeMirrorEditorProps = {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const CodeMirrorEditor: React.FC<any> = ({ onClick }) => {
  const editorRef = useRef(null);
  const viewRef = useRef<EditorView | null>(null);
  const [language, setLanguage] = useState("javascript");
  const { lang, setLang } = React.useContext(LangContext);
  const router = useRouter();

  const languageConf = useMemo(() => new Compartment(), []);

  useEffect(() => {
    if (!editorRef.current) return;

    const initialLanguage = javascript({ jsx: true, typescript: true });

    const state = EditorState.create({
      doc: `#include <iostream>
using namespace std;

int main() {
    long long A, B;
    cin >> A >> B;
    
    cout << "sum of a,b: " << (A + B) << endl;
    
    return 0;
}
`,
      extensions: [basicSetup, languageConf.of(initialLanguage)],
    });

    const view = new EditorView({
      state: state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  useEffect(() => {
    changeLanguage(lang);
    console.log("context has changed!", lang);
  }),
    [lang];

  const changeLanguage = (lang: string) => {
    if (!viewRef.current) return;

    let newLanguage: LanguageSupport;
    if (lang === "Javascript") {
      newLanguage = javascript({ jsx: true });
    } else if (lang === "Cpp") {
      newLanguage = cpp();
    } else {
      return;
    }

    viewRef.current.dispatch({
      effects: languageConf.reconfigure(newLanguage),
    });

    setLanguage(lang);
    console.log("language has changed!", newLanguage);
  };

  const handleSubmit = () => {
    if (!viewRef.current) return;
    const content = viewRef.current.state.doc.toString();
    console.log("제출할 내용:", content);
    router.push("/result");
  };

  return (
    <div className="w-full ">
      <div ref={editorRef} className="border rounded-md bg-white" />
      <div className="flex justify-end">
        <Button
          onClick={onClick}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded mx-2"
        >
          Execute
        </Button>
        <Button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CodeMirrorEditor;
