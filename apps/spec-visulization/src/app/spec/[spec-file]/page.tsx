import * as fs from "node:fs";
import yaml from "yaml";
import path from "node:path";
import dynamic from "next/dynamic";

const specMap: { [key: string]: string } = {
  repository: path.join(
    process.cwd(),
    "../../spec/repository/repository.spec.yaml"
  ),
};

const ClientPage = dynamic(() => import("./ClientPage"), { ssr: !!false });

export default async function SpecPage({ params }: any) {
  const fileName = (await params)["spec-file"];
  const localPath = specMap[fileName] as any;
  const fileContent = fs.readFileSync(localPath, "utf-8");
  const parsedContent = yaml.parse(fileContent);

  return <ClientPage title={fileName} fileContent={parsedContent} />;
}
