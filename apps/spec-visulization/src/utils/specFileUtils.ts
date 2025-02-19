import * as fs from "node:fs/promises";
import yaml from "yaml";

/**
 * Reads and parses a spec file and its UI schema
 * @param specFilePath Path to the spec file
 * @param uiSchemaPath Optional path to the UI schema file
 * @returns Object containing parsed spec and UI schema
 */
export async function readSpecFile(
  specFilePath: string,
  uiSchemaPath?: string
) {
  const specContent = await fs.readFile(specFilePath, "utf-8");
  const parsedSpec = yaml.parse(specContent);

  const uiSchemaContent = uiSchemaPath
    ? await fs.readFile(uiSchemaPath, "utf-8")
    : undefined;
  const parsedUiSchema = uiSchemaContent ? yaml.parse(uiSchemaContent) : {};

  return {
    spec: parsedSpec,
    uiSchema: parsedUiSchema,
    yamlSpec: specContent,
  };
}
