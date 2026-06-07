import { notFound } from "next/navigation";
import Link from "next/link";
import { getTemplateById } from "@/src/templates/index";
import DynamicForm from "@/src/components/DynamicForm";

interface PageProps {
  params: Promise<{ templateId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { templateId } = await params;
  const template = getTemplateById(templateId);
  return {
    title: template ? `${template.name} — Prompt Builder` : "Not Found",
  };
}

export default async function BuildPage({ params }: PageProps) {
  const { templateId } = await params;
  const template = getTemplateById(templateId);

  if (!template) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          ← All Templates
        </Link>
      </nav>

      <header className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
          {template.metadata.category}
        </span>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {template.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {template.shortDescription}
        </p>
      </header>

      <DynamicForm template={template} />
    </main>
  );
}
