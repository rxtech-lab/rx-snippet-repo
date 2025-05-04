"use client";
import Link from "next/link";
import Form from "@rjsf/fluent-ui";
import validator from "@rjsf/validator-ajv8";
import PermissionsWidget from "@/components/PermissionsWidget";
import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef, useCallback } from "react";
import yaml from "yaml";
import {
  Check,
  Copy,
  FileDown,
  PanelLeft,
  PanelRight,
  SplitSquareVertical,
  Trash2,
} from "lucide-react";
import JSONSchemaWidget from "@/components/JSONSchemaWidget";
import { CustomObjectField } from "@/components/CustomObjectField";
import { useParams } from "next/navigation";
import KeyValuePairField from "@/components/KeyValuePairField";
import ToggleableFieldTemplate from "@/components/templates/ToggleableFieldTemplate";
import { TooltipHost } from "@fluentui/react";
import JobSelectorWidget from "@/components/JobSelectorWidget";
import JobsArraySelectorWidget from "@/components/JobsArraySelectorWidget";

interface ClientPageProps {
  title: string;
  spec: { [key: string]: any };
  uiSchema?: { [key: string]: any };
}

// Create a debounce function
const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

/**
 * ClientPage component that displays a split view with a form and YAML preview
 * @param {ClientPageProps} props - Component props containing file content
 * @returns {JSX.Element} Split view with form and YAML preview
 */
export default function ClientPage({ spec, uiSchema }: ClientPageProps) {
  const params = useParams();
  const specFile = params["spec-file"] as string;
  const localStorageKey = `form-data-${specFile}`;

  // Initialize formData from localStorage if available
  const [formData, setFormData] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem(localStorageKey);
      return savedData ? JSON.parse(savedData) : {};
    }
    return {};
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"both" | "form" | "editor">("both");
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "initial">(
    "initial"
  );
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const widgets = {
    PermissionsWidget,
    JSONSchemaWidget,
    KeyValuePairField,
    JobSelectorWidget,
    JobsArraySelectorWidget,
  };

  const templates = {
    FieldTemplate: ToggleableFieldTemplate,
  };

  const formUiSchema = {
    "ui:submitButtonOptions": { norender: true },
    ...uiSchema,
  };

  // Save data to localStorage with debounce
  const saveFormData = useCallback(
    (data: any) => {
      // Clear any existing timeout
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }

      // Set status to saving immediately
      setSaveStatus("saving");

      // Set a new timeout for saving
      saveTimeout.current = setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem(localStorageKey, JSON.stringify(data));
          setSaveStatus("saved");
        }
        saveTimeout.current = null;
      }, 2000);
    },
    [localStorageKey]
  );

  /**
   * Handles form data changes and updates the YAML preview
   * @param {any} e - Form change event containing updated data
   */
  const handleChange = (e: any) => {
    setFormData(e.formData);
    saveFormData(e.formData);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  // Convert form data to YAML string
  const yamlString = yaml.stringify(formData, { indent: 2 });

  const [isCopied, setIsCopied] = useState(false);

  const fields = {
    ObjectField: CustomObjectField,
  };

  const handleFormatOpen = (format: "json" | "yaml") => {
    // Open in new tab
    window.open(
      `/api/spec/${params["spec-file"]}?content-type=${format}`,
      "_blank"
    );
    setIsDropdownOpen(false);
  };

  /**
   * Toggles the view mode between form, editor, or both
   * @param {string} mode - The view mode to set
   */
  const toggleViewMode = (mode: "both" | "form" | "editor") => {
    // Don't allow hiding both
    if (viewMode === mode && mode !== "both") {
      setViewMode("both");
    } else {
      setViewMode(mode);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Pass formData in formContext so the widgets can access it
  const formContext = { formData };

  return (
    <div
      className="bg-white px-4 sm:px-6 lg:px-8 pb-10"
      style={{ viewTransitionName: "page" }}
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 lg:mb-16 mt-6 lg:mt-10 sticky top-0 bg-white z-10 py-2 transition-all duration-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-block text-neutral-600 hover:text-neutral-900"
              >
                ← Back to Specs
              </Link>
              <span
                className={`text-sm transition-all duration-300 ease-in-out ${
                  saveStatus === "saving"
                    ? "text-amber-600"
                    : saveStatus === "saved"
                    ? "text-green-600"
                    : "opacity-0"
                }`}
              >
                {saveStatus === "saving"
                  ? "Saving changes..."
                  : "All changes saved"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <TooltipHost content="Clear all data">
                <button
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100 active:bg-red-200 transition-colors"
                  onClick={() => {
                    setFormData({});
                    setSaveStatus("saving");
                    saveFormData({});
                  }}
                  aria-label="Clear form data"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              </TooltipHost>
              <div className="flex items-center gap-2 border rounded-md p-1 bg-neutral-50">
                <TooltipHost content="Show both panels">
                  <button
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "both"
                        ? "bg-white shadow-sm text-blue-600"
                        : "hover:bg-neutral-100 text-neutral-500"
                    }`}
                    onClick={() => toggleViewMode("both")}
                    aria-label="Show both panels"
                  >
                    <SplitSquareVertical className="w-4 h-4" />
                  </button>
                </TooltipHost>

                <TooltipHost content="Show form only">
                  <button
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "form"
                        ? "bg-white shadow-sm text-blue-600"
                        : "hover:bg-neutral-100 text-neutral-500"
                    }`}
                    onClick={() => toggleViewMode("form")}
                    aria-label="Show form only"
                  >
                    <PanelLeft className="w-4 h-4" />
                  </button>
                </TooltipHost>

                <TooltipHost content="Show editor only">
                  <button
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "editor"
                        ? "bg-white shadow-sm text-blue-600"
                        : "hover:bg-neutral-100 text-neutral-500"
                    }`}
                    onClick={() => toggleViewMode("editor")}
                    aria-label="Show editor only"
                  >
                    <PanelRight className="w-4 h-4" />
                  </button>
                </TooltipHost>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 bg-neutral-100 px-3 py-2 rounded-md hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <FileDown className="w-4 h-4" />
                  <span>Open Spec</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleFormatOpen("json")}
                      >
                        Open as JSON
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleFormatOpen("yaml")}
                      >
                        Open as YAML
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-300 ease-in-out"
          style={{
            gridTemplateColumns:
              viewMode === "form"
                ? "1fr"
                : viewMode === "editor"
                ? "1fr"
                : undefined,
          }}
        >
          {viewMode !== "editor" && (
            <div className="form-container transition-opacity duration-300 ease-in-out">
              <Form
                schema={spec}
                validator={validator}
                uiSchema={formUiSchema}
                widgets={widgets}
                templates={templates}
                onChange={handleChange}
                fields={fields}
                formData={formData}
                formContext={formContext}
                liveValidate
                showErrorList={false}
              />
            </div>
          )}
          {viewMode !== "form" && (
            <div
              className={`yaml-preview h-[400px] lg:h-[800px] border border-neutral-200 rounded-xl transition-all duration-300 ease-in-out ${
                viewMode === "editor" ? "lg:col-span-2" : ""
              } lg:sticky lg:top-20`}
            >
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
                    <Check className="w-4 h-4 transition-all duration-200" />
                  ) : (
                    <Copy className="w-4 h-4 transition-all duration-200" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
