import path from "path";

export type SchemaFile = {
  uiSchema?: string;
  spec: string;
};

export const specMap: { [key: string]: SchemaFile } = {
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
