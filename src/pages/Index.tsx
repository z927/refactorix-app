import { BuilderHeader } from "@/components/project-builder/BuilderHeader";
import { BuilderStatusPanel } from "@/components/project-builder/BuilderStatusPanel";
import { ProjectBuilderForm } from "@/components/project-builder/ProjectBuilderForm";
import { useProjectBuilderForm } from "@/hooks/use-project-builder-form";

const quickMetrics = [
  { label: "Template pronti", value: "4" },
  { label: "Stack supportati", value: "4" },
  { label: "Workflow", value: "Guidato" },
];

const Index = () => {
  const { values, actions } = useProjectBuilderForm();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#182556,#060b1e_55%)] px-4 py-8 text-slate-100 sm:px-8">
      <section className="mx-auto w-full max-w-7xl space-y-6 rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(16,27,63,0.92),rgba(6,12,34,0.96))] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:p-8">
        <BuilderHeader />

        <div className="grid gap-3 sm:grid-cols-3">
          {quickMetrics.map((item) => (
            <article key={item.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">{item.label}</p>
              <p className="mt-1 text-2xl font-semibold text-white">{item.value}</p>
            </article>
          ))}
        </div>

        <BuilderStatusPanel model={values.model} onModelChange={actions.setModel} />
        <ProjectBuilderForm values={values} actions={actions} />
      </section>
    </main>
  );
};

export default Index;
