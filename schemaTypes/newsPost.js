import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "newsPost",
  title: "News",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "제목",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "썸네일",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "content",
      title: "내용",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "본문", value: "normal" },
            { title: "제목", value: "h2" },
            { title: "소제목", value: "h3" },
            { title: "인용", value: "blockquote" },
          ],
          lists: [
            { title: "글머리 기호", value: "bullet" },
            { title: "번호 목록", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "굵게", value: "strong" },
              { title: "기울임", value: "em" },
              { title: "밑줄", value: "underline" },
            ],
            annotations: [
              defineField({
                name: "link",
                title: "링크",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                  }),
                ],
              }),
            ],
          },
        }),
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
      publishedAt: "publishedAt",
      isHidden: "isHidden",
    },
    prepare({ title, media, publishedAt, isHidden }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString("ko-KR") : "날짜 없음";
      return {
        title,
        subtitle: `${date} · ${isHidden ? "숨김" : "노출"}`,
        media,
      };
    },
  },
});
