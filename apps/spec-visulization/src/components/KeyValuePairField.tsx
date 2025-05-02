"use client";
import Editor, { BeforeMount, OnMount } from "@monaco-editor/react";
import { WidgetProps } from "@rjsf/utils";
import { AlertCircle } from "lucide-react";
import { editor } from "monaco-editor";
import { useCallback, useRef, useState, useEffect } from "react";

/**
 * KeyValuePairField component that provides a Monaco editor for entering key-value pairs
 * with live validation
 * @param {WidgetProps} props - Widget properties from react-jsonschema-form
 * @returns {JSX.Element} Monaco editor with key-value pair validation
 */
const KeyValuePairField = (props: WidgetProps) => {
  const {
    value,
    onChange,
    disabled = false,
    readonly = false,
    schema,
    label,
    required = false,
  } = props;

  const [editorValue, setEditorValue] = useState<string>(
    value ? JSON.stringify(value, null, 2) : "{}"
  );
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<any>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  // Handle before mount to configure Monaco
  const handleBeforeMount: BeforeMount = (monaco) => {
    monacoRef.current = monaco;

    // Set up custom JSON validation rules
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      schemas: [
        {
          uri: "http://myserver/key-value-schema.json",
          fileMatch: ["*"],
          schema: {
            type: "object",
            additionalProperties: {
              type: ["string", "number", "boolean", "null"],
            },
          },
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

  // Validate if the content is a valid key-value pair object
  const validateKeyValuePair = (
    value: string
  ): { isValid: boolean; error: string | null } => {
    try {
      if (!value.trim()) {
        return { isValid: false, error: "Content cannot be empty" };
      }

      const parsed = JSON.parse(value);

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        return {
          isValid: false,
          error: "Content must be a valid object (key-value pairs)",
        };
      }

      // Check if all values are primitive types
      for (const key in parsed) {
        const val = parsed[key];
        if (val !== null && typeof val === "object") {
          return {
            isValid: false,
            error: `Value for key "${key}" must be a string, number, boolean, or null`,
          };
        }
      }

      return { isValid: true, error: null };
    } catch (error) {
      return { isValid: false, error: "Invalid JSON format" };
    }
  };

  // Handle value changes
  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const content = value || "{}";
      setEditorValue(content);

      const { isValid, error } = validateKeyValuePair(content);
      setIsValid(isValid);
      setValidationError(error);

      if (isValid) {
        try {
          const parsed = JSON.parse(content);
          onChange(parsed);
        } catch (error) {
          // This should never happen as we already validated the JSON
        }
      }
    },
    [onChange]
  );

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-bold">
        {schema.title ?? label}
        {required && <span className="text-red-500">*</span>}
      </h1>
      <p className="text-sm text-gray-500">{schema.description}</p>
      <div className="border rounded-xl flex flex-col gap-2 p-3">
        <Editor
          height="300px"
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
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Key-Value Pairs (JSON)</span>
          {!isValid && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {validationError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeyValuePairField;
