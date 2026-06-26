import { defineType } from "sanity";
import { createMagazinePostFields, magazinePostPreview } from "./magazinePostFields";

export default defineType({
  name: "eventPost",
  title: "id EVENT",
  type: "document",
  fields: createMagazinePostFields(),
  preview: magazinePostPreview,
});
