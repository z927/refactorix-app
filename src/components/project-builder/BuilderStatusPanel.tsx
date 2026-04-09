import { modelOptions } from "@/hooks/use-project-builder-form";

interface BuilderStatusPanelProps {
  model: string;
  onModelChange: (value: string) => void;
}

const ServiceBadge = ({ label, online }: { label: string; online: boolean }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
      online
        ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
        : "border-rose-400/40 bg-rose-500/10 text-rose-200"
    }`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-emerald-300" : "bg-rose-300"}`} />
    {label}
  </span>
);

export const BuilderStatusPanel = ({ model, onModelChange }: BuilderStatusPanelProps) => {
  return (
    <section className="mb-6 rounded-2xl border border-white/10 bg-slate-950/30 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Service health & runtime</h2>
        <div className="flex flex-wrap gap-2">
          <ServiceBadge label="LLM offline" online={false} />
          <ServiceBadge label="Qdrant offline" online={false} />
          <ServiceBadge label="Temporal online" online />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          Ollama non raggiungibile (n/a) · lat=n/ams · err=MISSING_TOKEN
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          Qdrant non raggiungibile (n/a) · lat=n/ams · err=MISSING_TOKEN · advice=n/a
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          Temporal @ localhost:7233 · ns=default · q=ai-engineer-runs · lat=0.1ms
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select
          value={model}
          onChange={(event) => onModelChange(event.target.value)}
          className="h-11 min-w-[280px] rounded-xl border border-white/20 bg-[#0a1436] px-3 text-sm text-slate-100 outline-none transition focus:border-blue-400"
        >
          <option value="">Seleziona modello</option>
          {modelOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button className="h-11 rounded-xl border border-white/20 bg-white/5 px-4 text-sm font-medium text-slate-100 transition hover:bg-white/10">
          Usa modello
        </button>
        <button className="h-11 rounded-xl border border-white/20 bg-white/5 px-4 text-sm font-medium text-slate-100 transition hover:bg-white/10">
          Refresh LLM
        </button>
      </div>
    </section>
  );
};
