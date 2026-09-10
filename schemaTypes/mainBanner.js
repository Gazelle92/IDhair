import { defineField, defineType } from "sanity";

export default defineType({
  name: "mainBanner",
  title: "메인 배너",
  type: "document",
  fields: [
    defineField({ name: "title", title: "제목", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "content", title: "내용", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
    defineField({ name: "url", title: "연결 링크", type: "url", validation: (Rule) => Rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }) }),
    defineField({ name: "sortOrder", title: "노출 순서", description: "작은 숫자부터 표시됩니다.", type: "number", initialValue: 0, validation: (Rule) => Rule.required().integer().min(0) }),
    defineField({ name: "isVisible", title: "노출 여부", type: "boolean", initialValue: true, validation: (Rule) => Rule.required() }),
  ],
  orderings: [{ title: "노출 순서", name: "sortOrderAsc", by: [{ field: "sortOrder", direction: "asc" }] }],
  preview: {
    select: { title: "title", order: "sortOrder", visible: "isVisible" },
    prepare: ({ title, order, visible }) => ({ title, subtitle: `${order ?? 0} · ${visible ? "노출" : "숨김"}` }),
  },
});
