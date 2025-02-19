import { SchemaFile, specMap } from "@/utils/specMap";
import { readSpecFile } from "@/utils/specFileUtils";
import dynamic from "next/dynamic";

const ClientPage = dynamic(() => import("./ClientPage"), { ssr: !!false });

export default async function SpecPage({ params }: any) {
  const fileName = (await params)["spec-file"];
  const localPath = specMap[fileName] as SchemaFile;

  const { spec, uiSchema } = await readSpecFile(
    localPath.spec,
    localPath.uiSchema
  );

  return <ClientPage title={fileName} spec={spec} uiSchema={uiSchema} />;
}
