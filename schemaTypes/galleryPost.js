import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "galleryPost",
  title: "id GALLERY",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "제목",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "날짜",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "대표 이미지",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "images",
      title: "갤러리 이미지",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          title: "이미지",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "대체 텍스트",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "캡션",
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
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString("ko-KR") : "날짜 없음";

      return {
        title,
        subtitle: `${date} · ${isHidden ? "숨김" : "노출"}`,
        media: media || firstImage,
      };
    },
  },
});
