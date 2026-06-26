import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { deskStructure } from "./schemaTypes/deskStructure";

export default defineConfig({
  name: "default",
  title: "IDHAIR Studio",
  projectId: "9pry8zdk",
  dataset: "production",
  plugins: [structureTool({ structure: deskStructure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
