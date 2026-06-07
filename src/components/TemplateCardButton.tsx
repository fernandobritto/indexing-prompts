import Link from "next/link";
import type { TemplateDefinition } from "@/src/types/template";

interface Props {
  template: TemplateDefinition;
}

export default function TemplateCardButton({ template }: Props) {
  return (
    <Link
      href={`/build/${template.id}`}
      className="group flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-6 text-left transition-all hover:border-blue-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-500"
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
        {template.metadata.category}
      </span>
      <h2 className="text-base font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
        {template.name}
      </h2>
      <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        {template.shortDescription}
      </p>
    </Link>
  );
}
