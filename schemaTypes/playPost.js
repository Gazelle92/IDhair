import { defineArrayMember, defineField, defineType } from "sanity";
import DisplayTypeInput from "./components/DisplayTypeInput";

export default defineType({
  name: "playPost",
  title: "id PLAY",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "id PLAY",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Play Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          title: "Image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "displayType",
              title: "Display Type",
              description: "type-a: 9 / 16, type-b: 16 / 9",
              type: "string",
              options: {
                list: [
                  { title: "type-a - 9 / 16", value: "type-a" },
                  { title: "type-b - 16 / 9", value: "type-b" },
                ],
              },
              components: {
                input: DisplayTypeInput,
              },
              initialValue: "type-a",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
        }),
        defineArrayMember({
          type: "object",
          name: "youtubeVideo",
          title: "YouTube Video",
          fields: [
            defineField({
              name: "youtubeUrl",
              title: "YouTube URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "displayType",
              title: "Display Type",
              description: "type-a: 9 / 16, type-b: 16 / 9",
              type: "string",
              options: {
                list: [
                  { title: "type-a - 9 / 16", value: "type-a" },
                  { title: "type-b - 16 / 9", value: "type-b" },
                ],
              },
              components: {
                input: DisplayTypeInput,
              },
              initialValue: "type-b",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "title",
              youtubeUrl: "youtubeUrl",
              displayType: "displayType",
            },
            prepare({ title, youtubeUrl, displayType }) {
              return {
                title: title || "YouTube Video",
                subtitle: `${displayType || "type-b"} - ${youtubeUrl || ""}`,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).required(),
    }),
    defineField({
      name: "isHidden",
      title: "포스팅 숨기기",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      firstImage: "images.0",
      publishedAt: "publishedAt",
      isHidden: "isHidden",
    },
    prepare({ title, firstImage, publishedAt, isHidden }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString("ko-KR") : "No date";

      return {
        title: title || "id PLAY",
        subtitle: `${date} - ${isHidden ? "숨김" : "노출"}`,
        media: firstImage,
      };
    },
  },
});
