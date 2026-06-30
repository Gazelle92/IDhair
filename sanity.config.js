import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
import { deskStructure } from "./schemaTypes/deskStructure";

export default defineConfig({
  name: "default",
  title: "IDHAIR Studio",
  projectId: "9pry8zdk",
  dataset: "production",
  plugins: [structureTool({ structure: deskStructure })],
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: "salonLocation-seoul",
        title: "SALON - 서울",
        schemaType: "salonLocation",
        value: {
          region: "seoul",
        },
      },
      {
        id: "salonLocation-gyeonggi",
        title: "SALON - 경기",
        schemaType: "salonLocation",
        value: {
          region: "gyeonggi",
        },
      },
      {
        id: "salonLocation-local",
        title: "SALON - 지방",
        schemaType: "salonLocation",
        value: {
          region: "local",
        },
      },
    ],
  },
});
