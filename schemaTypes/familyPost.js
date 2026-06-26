import { defineType } from "sanity";
import { createMagazinePostFields, magazinePostPreview } from "./magazinePostFields";

export default defineType({
  name: "familyPost",
  title: "id FAMILY",
  type: "document",
  fields: createMagazinePostFields(),
  preview: magazinePostPreview,
});
