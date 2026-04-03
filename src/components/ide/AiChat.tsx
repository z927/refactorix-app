import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const AiChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Ciao! Sono il tuo assistente AI. Posso aiutarti con il codice, spiegare funzioni, trovare bug o suggerire miglioramenti. Come posso aiutarti?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulated AI response
    setTimeout(() => {
      const responses = [
        "Ho analizzato il codice. Ecco cosa ho trovato:\n\n```typescript\n// Suggerimento: usa useMemo per ottimizzare\nconst result = useMemo(() => {\n  return heavyComputation(data);\n}, [data]);\n```\n\nQuesto migliorerà le performance evitando ricalcoli inutili.",
        "Ottima domanda! Il pattern che stai usando è corretto. Ti suggerisco di aggiungere anche la gestione degli errori con un try/catch block per rendere il codice più robusto.",
        "Ho trovato un potenziale problema nel tuo codice. La funzione non gestisce il caso in cui l'input sia `undefined`. Aggiungi un check opzionale:\n\n```typescript\nconst value = data?.property ?? defaultValue;\n```",
      ];
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responses[Math.floor(Math.random() * responses.length)] },
      ]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border bg-ide-header px-3 py-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">AI Assistant</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {msg.content.split("```").map((part, idx) => {
                if (idx % 2 === 1) {
                  // Code block
                  const lines = part.split("\n");
                  const lang = lines[0];
                  const code = lines.slice(1).join("\n");
                  return (
                    <pre key={idx} className="my-2 rounded bg-background p-2 font-mono text-xs overflow-x-auto">
                      <code>{code || part}</code>
                    </pre>
                  );
                }
                return <span key={idx}>{part}</span>;
              })}
            </div>
            {msg.role === "user" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/30">
                <User className="h-4 w-4 text-accent" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20">
              <Bot className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <div className="rounded-lg bg-muted px-3 py-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Chiedi qualcosa sul codice..."
            className="flex-1 rounded-lg bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
