import { defineField, defineType } from "sanity";

export default defineType({
  name: "aboutSettings",
  title: "ABOUT Settings",
  type: "document",
  fields: [
    defineField({
      name: "introVideo",
      title: "Intro Video",
      description: "Upload the ABOUT intro background video.",
      type: "file",
      options: {
        accept: "video/mp4,video/webm,video/quicktime",
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "ABOUT Settings",
      };
    },
  },
});
