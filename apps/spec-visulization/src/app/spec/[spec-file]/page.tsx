import * as fs from "node:fs";
import yaml from "yaml";
import path from "node:path";
import dynamic from "next/dynamic";

type SchemaFile = {
  uiSchema?: string;
  spec: string;
};

const specMap: { [key: string]: SchemaFile } = {
  repository: {
    uiSchema: path.join(
      process.cwd(),
      "../../spec/repository/repository.ui.schema.yaml"
    ),
    spec: path.join(
      process.cwd(),
      "../../spec/repository/repository.spec.yaml"
    ),
  },
  compiler: {
    spec: path.join(process.cwd(), "../../spec/repository/compiler.spec.yaml"),
  },
};

const ClientPage = dynamic(() => import("./ClientPage"), { ssr: !!false });

export default async function SpecPage({ params }: any) {
  const fileName = (await params)["spec-file"];
  const localPath = specMap[fileName] as SchemaFile;
  const specContent = fs.readFileSync(localPath.spec, "utf-8");
  const parsedSpec = yaml.parse(specContent);

  const uiSchemaContent = localPath.uiSchema
    ? fs.readFileSync(localPath.uiSchema, "utf-8")
    : undefined;
  const parsedUiSchema = uiSchemaContent ? yaml.parse(uiSchemaContent) : {};

  return (
    <ClientPage title={fileName} spec={parsedSpec} uiSchema={parsedUiSchema} />
  );
}
