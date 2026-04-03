import { X } from "lucide-react";

interface OpenTab {
  name: string;
  path: string;
  content: string;
  language?: string;
}

interface CodeEditorProps {
  openTabs: OpenTab[];
  activeTab: string | null;
  onTabSelect: (path: string) => void;
  onTabClose: (path: string) => void;
}

const highlightLine = (line: string): React.ReactNode[] => {
  const tokens: React.ReactNode[] = [];
  // Simple syntax highlighting via regex
  const patterns: [RegExp, string][] = [
    [/\/\/.*/g, "text-ide-comment"],
    [/"[^"]*"|'[^']*'|`[^`]*`/g, "text-ide-string"],
    [/\b(import|from|export|default|const|let|var|function|return|if|else|for|while|class|interface|type|extends|implements|new|this|async|await|try|catch|throw)\b/g, "text-ide-keyword"],
    [/\b(true|false|null|undefined|void)\b/g, "text-ide-keyword"],
    [/\b\d+\.?\d*\b/g, "text-ide-number"],
    [/\b([A-Z][a-zA-Z0-9]*)\b/g, "text-ide-type"],
    [/\b([a-z][a-zA-Z0-9]*)\s*(?=\()/g, "text-ide-function"],
  ];

  // Simple approach: just return colored spans for known tokens
  let remaining = line;
  let key = 0;

  // Comment takes priority
  const commentIdx = remaining.indexOf("//");
  if (commentIdx !== -1) {
    const before = remaining.slice(0, commentIdx);
    const comment = remaining.slice(commentIdx);
    return [
      <span key={key++}>{highlightSegment(before, patterns)}</span>,
      <span key={key++} className="text-ide-comment">{comment}</span>,
    ];
  }

  return [<span key={0}>{highlightSegment(remaining, patterns)}</span>];
};

const highlightSegment = (text: string, patterns: [RegExp, string][]): React.ReactNode => {
  // Very basic: apply patterns sequentially via split
  let parts: React.ReactNode[] = [text];

  for (const [pattern, className] of patterns) {
    const newParts: React.ReactNode[] = [];
    for (const part of parts) {
      if (typeof part !== "string") {
        newParts.push(part);
        continue;
      }
      const regex = new RegExp(pattern.source, "g");
      let lastIdx = 0;
      let match;
      while ((match = regex.exec(part)) !== null) {
        if (match.index > lastIdx) {
          newParts.push(part.slice(lastIdx, match.index));
        }
        newParts.push(
          <span key={`${match.index}-${className}`} className={className}>
            {match[0]}
          </span>
        );
        lastIdx = regex.lastIndex;
      }
      if (lastIdx < part.length) {
        newParts.push(part.slice(lastIdx));
      }
    }
    parts = newParts;
  }

  return <>{parts}</>;
};

export const CodeEditor = ({ openTabs, activeTab, onTabSelect, onTabClose }: CodeEditorProps) => {
  const activeFile = openTabs.find((t) => t.path === activeTab);

  if (!activeFile) {
    return (
      <div className="flex h-full flex-col bg-ide-panel">
        <div className="h-9 bg-ide-header border-b border-border" />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium mb-1">Nessun file aperto</p>
            <p className="text-sm">Seleziona un file dall'explorer per iniziare</p>
          </div>
        </div>
      </div>
    );
  }

  const lines = activeFile.content.split("\n");

  return (
    <div className="flex h-full flex-col bg-ide-panel">
      {/* Tabs */}
      <div className="flex h-9 bg-ide-header border-b border-border overflow-x-auto">
        {openTabs.map((tab) => (
          <div
            key={tab.path}
            className={`flex items-center gap-1.5 px-3 text-sm cursor-pointer border-r border-border shrink-0 transition-colors ${
              tab.path === activeTab
                ? "bg-ide-tab-active text-foreground border-t-2 border-t-primary"
                : "bg-ide-tab-inactive text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onTabSelect(tab.path)}
          >
            <span className="truncate max-w-32">{tab.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.path);
              }}
              className="ml-1 rounded p-0.5 hover:bg-muted transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Code content */}
      <div className="flex-1 overflow-auto font-mono text-sm">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-ide-line-highlight transition-colors">
                <td className="select-none text-right pr-4 pl-4 py-0 text-ide-line-number w-12 align-top text-xs leading-6">
                  {i + 1}
                </td>
                <td className="py-0 pr-4 leading-6 whitespace-pre text-ide-variable">
                  {highlightLine(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status bar */}
      <div className="flex h-6 items-center justify-between border-t border-border bg-ide-header px-3 text-xs text-muted-foreground">
        <div className="flex gap-3">
          <span>{activeFile.language || "plaintext"}</span>
          <span>UTF-8</span>
        </div>
        <div className="flex gap-3">
          <span>Ln {lines.length}</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
};
