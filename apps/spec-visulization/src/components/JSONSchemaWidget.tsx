"use client";
import Editor, { BeforeMount, OnMount } from "@monaco-editor/react";
import { Form } from "@rjsf/fluent-ui";
import { getUiOptions, WidgetProps } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { Eye } from "lucide-react";
import { editor } from "monaco-editor";
import { useCallback, useRef, useState, useEffect } from "react";
import Dialog from "./Dialog";

/**
 * JSONSchemaWidget component that provides a Monaco editor for JSON schema editing
 * with validation and autocompletion
 * @param {WidgetProps} props - Widget properties from react-jsonschema-form
 * @returns {JSX.Element} Monaco editor with JSON schema capabilities
 */
const JSONSchemaWidget: React.FC<WidgetProps> = ({
  value,
  onChange,
  disabled,
  readonly,
  schema: formSchema,
  name,
  uiSchema,
  required,
}) => {
  const [editorValue, setEditorValue] = useState<string>(
    value ? JSON.stringify(value, null, 2) : ""
  );
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isValidJson, setIsValidJson] = useState(true);
  const [parsedValue, setParsedValue] = useState<any>(value);

  const uiOption = getUiOptions(uiSchema);
  const schema = uiOption.schema;

  // Handle before mount to configure Monaco
  const handleBeforeMount: BeforeMount = async (monaco) => {
    monacoRef.current = monaco;
    if (!schema) return;
    // fetch the schema from the url
    const response = await fetch(schema.toString());
    const schemaJson = await response.json();

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: schema.toString(),
          fileMatch: ["*"],
          schema: schemaJson,
        },
      ],
    });
  };

  /**
   * Formats the editor content using Monaco's built-in formatter
   */
  const formatEditorContent = useCallback(() => {
    if (editorRef.current) {
      const action = editorRef.current.getAction(
        "editor.action.formatDocument"
      );
      if (action) {
        action.run();
      }
    }
  }, []);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        const isFocused = editorRef.current?.hasTextFocus();
        if (!isFocused) return;
        e.preventDefault();
        formatEditorContent();
      }
    };

    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [formatEditorContent]);

  // Handle editor mount
  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  // Handle value changes
  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      setEditorValue(value || "");
      try {
        if (value) {
          const parsed = JSON.parse(value);
          setParsedValue(parsed);
          setIsValidJson(true);
          onChange(parsed);
        }
      } catch (error) {
        setIsValidJson(false);
      }
    },
    [onChange]
  );

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-bold">
        {formSchema.title ?? name}{" "}
        {required && <span className="text-red-500">*</span>}
      </h1>
      <p className="text-sm text-gray-500">{formSchema.description}</p>
      <div className="border rounded-xl flex flex-col gap-2 p-3">
        <div className="flex justify-end">
          <button
            onClick={() => setShowPreview(true)}
            disabled={!isValidJson}
            type="button"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
              isValidJson
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "bg-gray-50 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview Form
          </button>
        </div>
        <Editor
          height="400px"
          defaultLanguage="json"
          value={editorValue}
          onChange={handleEditorChange}
          beforeMount={handleBeforeMount}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            lineNumbers: "on",
            wordWrap: "on",
            readOnly: disabled || readonly,
            formatOnPaste: true,
            formatOnType: true,
            contextmenu: false,
            suggest: {
              showProperties: true,
            },
          }}
        />
        <span className="text-sm text-gray-500">JSON</span>
      </div>

      <Dialog
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Form Preview"
      >
        <div className="min-h-[400px]">
          <Form
            schema={parsedValue ?? {}}
            validator={validator}
            uiSchema={{ "ui:submitButtonOptions": { norender: true } }}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default JSONSchemaWidget;
