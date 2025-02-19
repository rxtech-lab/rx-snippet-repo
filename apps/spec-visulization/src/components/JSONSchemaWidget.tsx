"use client";
import Editor, { BeforeMount, OnMount } from "@monaco-editor/react";
import { WidgetProps } from "@rjsf/utils";
import { editor } from "monaco-editor";
import { useCallback, useRef, useState } from "react";

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
}) => {
  const [editorValue, setEditorValue] = useState<string>(
    value ? JSON.stringify(value, null, 2) : ""
  );
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<any>(null);

  // Handle before mount to configure Monaco
  const handleBeforeMount: BeforeMount = (monaco) => {
    monacoRef.current = monaco;

    // Register JSON Schema for validation
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: "https://json-schema.org/draft-07/schema",
          fileMatch: ["*"],
          schema: {
            $ref: "https://json-schema.org/draft-07/schema",
          },
        },
      ],
    });
  };

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
          const parsedValue = JSON.parse(value);
          onChange(parsedValue);
        }
      } catch (error) {
        // Invalid JSON - don't update the form value
      }
    },
    [onChange]
  );

  return (
    <div className="border rounded-md overflow-hidden ">
      <h1>hi</h1>
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
          scrollBeyondLastLine: false,
          wordWrap: "on",
          readOnly: disabled || readonly,
          formatOnPaste: true,
          formatOnType: true,
          automaticLayout: true,
          suggest: {
            showProperties: true,
          },
        }}
      />
    </div>
  );
};

export default JSONSchemaWidget;
