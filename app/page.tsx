import { templates } from "@/src/templates/index";
import TemplateCardButton from "@/src/components/TemplateCardButton";

export const metadata = {
  title: "Indexing Prompts: Prompt Template Builder",
  description:
    "Select a template to build and export a structured engineering prompt.",
};

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Prompt Template Builder
        </h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
          Choose a template, fill in the details, and export a ready-to-use
          engineering prompt.
        </p>
      </header>

      <section aria-label="Available templates">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Select a template
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {templates.map((template) => (
            <TemplateCardButton key={template.id} template={template} />
          ))}
        </div>
      </section>
    </main>
  );
}
