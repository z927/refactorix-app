import { Link } from "react-router-dom";
import { Box, Sparkles, Wand2 } from "lucide-react";

export const BuilderHeader = () => {
  return (
    <header className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-200">
        <Sparkles className="h-3.5 w-3.5" />
        AI orchestration
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-semibold text-white sm:text-4xl">
            <Box className="h-9 w-9 fill-amber-400/40 text-amber-300" strokeWidth={1.8} />
            Framework &amp; Project Builder
          </h1>
          <p className="mt-3 max-w-3xl text-base text-slate-300 sm:text-lg">
            Definisci stack, template e feature in un unico flusso guidato. Il builder prepara il contesto ideale
            per generare un progetto pronto per il delivery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/project-viewer"
            className="inline-flex h-11 items-center rounded-xl border border-white/20 bg-white/5 px-4 text-sm font-medium text-slate-100 transition hover:bg-white/10"
          >
            Apri Project Viewer
          </Link>
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-blue-400/50 bg-blue-500/20 px-4 text-sm font-medium text-blue-100 transition hover:bg-blue-500/30"
          >
            <Wand2 className="h-4 w-4" />
            Workflow guidato
          </button>
        </div>
      </div>
    </header>
  );
};
