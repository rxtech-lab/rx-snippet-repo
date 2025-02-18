"use client";
import Link from "next/link";
import Form from "@rjsf/fluent-ui";
import validator from "@rjsf/validator-ajv8";

interface ClientPageProps {
  title: string;
  fileContent: { [key: string]: any };
}

export default function ClientPage({ title, fileContent }: ClientPageProps) {
  return (
    <div
      className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8"
      style={{ viewTransitionName: "page" }}
    >
      <div className="mx-auto max-w-2xl">
        <header className="mb-16 border-b border-neutral-200 pb-8">
          <Link
            href="/"
            className="inline-block mb-4 text-neutral-600 hover:text-neutral-900"
            onClick={(e) => {
              e.preventDefault();
              document.startViewTransition(() => {
                window.location.href = "/";
              });
            }}
          >
            ← Back to Specs
          </Link>
        </header>

        <Form schema={fileContent} validator={validator} />
      </div>
    </div>
  );
}
