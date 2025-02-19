"use client";
import Link from "next/link";
import Form from "@rjsf/fluent-ui";
import validator from "@rjsf/validator-ajv8";
import PermissionsWidget from "@/components/PermissionsWidget";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import yaml from "yaml";
import { Check, Copy } from "lucide-react";
import JSONSchemaWidget from "@/components/JSONSchemaWidget";
import { CustomObjectField } from "@/components/CustomObjectField";

interface ClientPageProps {
  title: string;
  spec: { [key: string]: any };
  uiSchema?: { [key: string]: any };
}

/**
 * ClientPage component that displays a split view with a form and YAML preview
 * @param {ClientPageProps} props - Component props containing file content
 * @returns {JSX.Element} Split view with form and YAML preview
 */
export default function ClientPage({ spec, uiSchema }: ClientPageProps) {
  const [formData, setFormData] = useState<any>({});

  const widgets = {
    PermissionsWidget,
    JSONSchemaWidget,
  };

  const formUiSchema = {
    "ui:submitButtonOptions": { norender: true },
    ...uiSchema,
  };

  /**
   * Handles form data changes and updates the YAML preview
   * @param {any} e - Form change event containing updated data
   */
  const handleChange = (e: any) => {
    setFormData(e.formData);
  };

  // Convert form data to YAML string
  const yamlString = yaml.stringify(formData, { indent: 2 });

  const [isCopied, setIsCopied] = useState(false);

  const fields = {
    ObjectField: CustomObjectField,
  };

  return (
    <div
      className="bg-white px-4 sm:px-6 lg:px-8 pb-10"
      style={{ viewTransitionName: "page" }}
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 lg:mb-16 border-b border-neutral-200 mt-6 lg:mt-10">
          <Link
            href="/"
            className="inline-block mb-4 text-neutral-600 hover:text-neutral-900"
          >
            ← Back to Specs
          </Link>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="form-container">
            <Form
              schema={spec}
              validator={validator}
              uiSchema={formUiSchema}
              widgets={widgets}
              onChange={handleChange}
              fields={fields}
            />
          </div>
          <div className="yaml-preview h-[400px] lg:h-[800px] border border-neutral-200 rounded-xl lg:sticky lg:top-10">
            <div className="relative h-full p-2">
              <Editor
                height="100%"
                defaultLanguage="yaml"
                value={yamlString}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  lineNumbers: "on",
                  theme: "vs-light",
                }}
              />
              <button
                className="absolute top-2 right-2 bg-neutral-100 px-2 py-1 rounded-md hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(yamlString);
                  setIsCopied(true);
                  setTimeout(() => {
                    setIsCopied(false);
                  }, 2000);
                }}
                aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
              >
                {isCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
