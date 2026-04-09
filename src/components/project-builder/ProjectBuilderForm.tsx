import { Dispatch, SetStateAction } from "react";
import { stackOptions, templateOptions } from "@/hooks/use-project-builder-form";

interface ProjectBuilderFormProps {
  values: {
    projectName: string;
    featureRequest: string;
    basePath: string;
    stack: string;
    template: string;
    initGit: boolean;
    installDeps: boolean;
  };
  actions: {
    setProjectName: (value: string) => void;
    setFeatureRequest: (value: string) => void;
    setBasePath: (value: string) => void;
    setStack: (value: string) => void;
    setTemplate: (value: string) => void;
    setInitGit: Dispatch<SetStateAction<boolean>>;
    setInstallDeps: Dispatch<SetStateAction<boolean>>;
  };
}

const inputClassName =
  "h-12 w-full rounded-xl border border-white/20 bg-[#0a1436] px-4 text-slate-100 outline-none transition focus:border-blue-400";

export const ProjectBuilderForm = ({ values, actions }: ProjectBuilderFormProps) => {
  return (
    <form className="space-y-6 rounded-2xl border border-white/10 bg-slate-950/30 p-5">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <label className="space-y-2 xl:col-span-5">
          <span className="text-sm font-medium text-slate-200">Nome progetto</span>
          <input value={values.projectName} onChange={(event) => actions.setProjectName(event.target.value)} className={inputClassName} />
        </label>

        <label className="space-y-2 xl:col-span-3">
          <span className="text-sm font-medium text-slate-200">Stack</span>
          <select value={values.stack} onChange={(event) => actions.setStack(event.target.value)} className={inputClassName}>
            {stackOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 xl:col-span-4">
          <span className="text-sm font-medium text-slate-200">Template</span>
          <select value={values.template} onChange={(event) => actions.setTemplate(event.target.value)} className={inputClassName}>
            {templateOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-200">Feature richiesta</span>
        <textarea
          value={values.featureRequest}
          onChange={(event) => actions.setFeatureRequest(event.target.value)}
          rows={4}
          className="w-full rounded-xl border border-white/20 bg-[#0a1436] px-4 py-3 text-slate-100 outline-none transition focus:border-blue-400"
          placeholder="Es: crea una dashboard admin con autenticazione e gestione utenti"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-200">Base path</span>
        <input value={values.basePath} onChange={(event) => actions.setBasePath(event.target.value)} className={inputClassName} />
      </label>

      <div className="flex flex-wrap items-center gap-5 text-sm text-slate-100">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.initGit}
            onChange={() => actions.setInitGit((value) => !value)}
            className="h-4 w-4 rounded border border-white/30 bg-[#0a1436] accent-[#436fff]"
          />
          init git
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.installDeps}
            onChange={() => actions.setInstallDeps((value) => !value)}
            className="h-4 w-4 rounded border border-white/30 bg-[#0a1436] accent-[#436fff]"
          />
          install deps
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          className="h-11 rounded-xl border border-white/25 bg-transparent px-5 text-sm font-medium text-slate-200 transition hover:bg-white/5"
        >
          Crea solo progetto
        </button>
        <button
          type="button"
          className="h-11 rounded-xl border border-blue-400/50 bg-blue-500/20 px-5 text-sm font-medium text-blue-100 transition hover:bg-blue-500/30"
        >
          Crea framework software
        </button>
        <p className="text-sm text-slate-400">Role attuale: guest — reviewer/admin richiesto.</p>
      </div>
    </form>
  );
};
