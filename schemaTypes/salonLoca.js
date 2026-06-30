import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "salonLocation",
  title: "SALON",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "매장명",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "region",
      title: "지역",
      type: "string",
      options: {
        layout: "dropdown",
        list: [
          { title: "서울", value: "seoul" },
          { title: "경기", value: "gyeonggi" },
          { title: "지방", value: "local" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "주소",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "전화번호",
      type: "string",
    }),
    defineField({
      name: "hours",
      title: "영업시간",
      type: "string",
      description: "ex) 10:00 - 21:30",
      placeholder: "ex) 10:00 - 21:30",
    }),
    defineField({
      name: "off",
      title: "휴무일",
      type: "string",
    }),
    defineField({
      name: "instagramUrl",
      title: "인스타그램 URL",
      type: "url",
    }),
    defineField({
      name: "reservationUrl",
      title: "네이버 예약 URL",
      type: "url",
    }),
    defineField({
      name: "images",
      title: "매장 이미지",
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
          ],
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "order",
      title: "노출 순서",
      type: "number",
      initialValue: 0,
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
      title: "name",
      subtitle: "address",
      media: "images.0",
      region: "region",
      isHidden: "isHidden",
    },
    prepare({ title, subtitle, media, region, isHidden }) {
      return {
        title,
        subtitle: `${region || "지역 없음"} - ${isHidden ? "숨김" : "노출"} - ${subtitle || "주소 없음"}`,
        media,
      };
    },
  },
});
