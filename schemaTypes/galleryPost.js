import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "galleryPost",
  title: "id GALLERY",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "publishedAt",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "images",
      title: "Gallery Images",
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
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
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
      media: "thumbnail",
      firstImage: "images.0",
      publishedAt: "publishedAt",
      isHidden: "isHidden",
    },
    prepare({ title, media, firstImage, publishedAt, isHidden }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString("ko-KR") : "No date";

      return {
        title,
        subtitle: `${date} - ${isHidden ? "숨김" : "노출"}`,
        media: media || firstImage,
      };
    },
  },
});
