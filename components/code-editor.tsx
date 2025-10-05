"use client"
import CodeMirror from "@uiw/react-codemirror"
import { oneDark } from "@uiw/codemirror-theme-one-dark"
import {
  javascript,
  typescript,
  python,
  java,
  cpp,
  csharp,
  php,
  ruby,
  go,
  rust,
  swift,
  kotlin,
  html as htmlLang,
  css as cssLang,
  sql as sqlLang,
  json as jsonLang,
  shell as shellLang,
  graphql as graphqlLang,
  markdown,
} from "@uiw/codemirror-extensions-langs"

type CodeEditorProps = {
  value: string
  onChange: (val: string) => void
  language?: string
  height?: string
  className?: string
}

function getExtensions(lang?: string) {
  const l = (lang || "").toLowerCase()

  // normalize some common aliases from our dropdown
  const alias = {
    "node.js": "javascript",
    "next.js": "typescript",
    "express.js": "javascript",
    nestjs: "typescript",
    "vue.js": "javascript",
    angular: "typescript",
    svelte: "javascript",
    deno: "typescript",
    bash: "shell",
    powershell: "shell",
  } as Record<string, string>

  const normalized = alias[l] || l

  switch (normalized) {
    case "javascript":
    case "react":
      return [javascript({ jsx: true })]
    case "typescript":
      return [typescript({ jsx: true })]
    case "python":
      return [python()]
    case "java":
      return [java()]
    case "c++":
      return [cpp()]
    case "c#":
      return [csharp()]
    case "php":
      return [php()]
    case "ruby":
      return [ruby()]
    case "go":
      return [go()]
    case "rust":
      return [rust()]
    case "swift":
      return [swift()]
    case "kotlin":
      return [kotlin()]
    case "html":
      return [htmlLang()]
    case "css":
    case "scss":
      return [cssLang()]
    case "sql":
      return [sqlLang()]
    case "json":
      return [jsonLang()]
    case "shell":
      return [shellLang()]
    case "graphql":
      return [graphqlLang()]
    default:
      // safe fallback that still provides nice formatting
      return [markdown()]
  }
}

export function CodeEditor({ value, onChange, language, height = "340px", className }: CodeEditorProps) {
  return (
    <div className={className}>
      <CodeMirror
        value={value}
        theme={oneDark}
        // You can tweak basicSetup in the future if you want additional features
        extensions={getExtensions(language)}
        height={height}
        onChange={(val) => onChange(val)}
        // Accessibility
        aria-label="Code editor"
        autoFocus={false}
      />
    </div>
  )
}

export default CodeEditor
