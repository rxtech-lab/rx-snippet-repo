import * as fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import ClientPage from "./ClientPage";
import yaml from "yaml";
const specMap: { [key: string]: string } = {
  repository: "../../spec/repository/repository.spec.yaml",
};

export default async function SpecPage({ params }: any) {
  const fileName = (await params)["spec-file"];
  const filePath = specMap[fileName] as any;
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const parsedContent = yaml.parse(fileContent);

  return <ClientPage title={fileName} fileContent={parsedContent} />;
}
