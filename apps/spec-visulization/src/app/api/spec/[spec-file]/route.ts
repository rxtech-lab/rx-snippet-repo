import { specMap } from "@/utils/specMap";
import { readSpecFile } from "@/utils/specFileUtils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: any }) {
  // get content type from header or query params
  const contentType =
    request.headers.get("content-type") ||
    request.nextUrl.searchParams.get("content-type");
  if (!contentType) {
    return new Response("No content type", { status: 400 });
  }

  // get spec file name
  const specFileName = params["spec-file"];
  if (!specFileName) {
    return new Response("No spec file name", { status: 400 });
  }

  // get spec file path
  const specFilePath = specMap[specFileName];
  if (!specFilePath) {
    return new Response("Spec file not found", { status: 404 });
  }

  try {
    const { spec, yamlSpec } = await readSpecFile(specFilePath.spec);
    if (contentType === "application/json" || contentType === "json") {
      return new Response(JSON.stringify(spec), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
    return new Response(yamlSpec, {
      headers: { "Content-Type": "text/yaml" },
    });
  } catch (error) {
    return new Response("Error reading spec file", { status: 500 });
  }
}
