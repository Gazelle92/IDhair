const magazinePostItems = [
  { id: "newsPost", title: "id NEWS", type: "newsPost" },
  { id: "eventPost", title: "id EVENT", type: "eventPost" },
  { id: "familyPost", title: "id FAMILY", type: "familyPost" },
  { id: "galleryPost", title: "id GALLERY", type: "galleryPost" },
  { id: "playPost", title: "id PLAY", type: "playPost" },
];

const salonItems = [
  { id: "salonLocationSeoul", title: "SALON - 서울", region: "seoul", templateId: "salonLocation-seoul" },
  { id: "salonLocationGyeonggi", title: "SALON - 경기", region: "gyeonggi", templateId: "salonLocation-gyeonggi" },
  { id: "salonLocationLocal", title: "SALON - 지방", region: "local", templateId: "salonLocation-local" },
  { id: "salonLocationAtelier", title: "SALON - 아틀리에", region: "atelier", templateId: "salonLocation-atelier" },
];

const languageItems = (S, suffix = "") => {
  const type = (name) => `${name}${suffix}`;
  const title = (name) => suffix ? `${name} (EN)` : name;
  return [
        S.listItem()
          .id(type("mainBanner"))
          .title("메인 배너")
          .child(S.documentTypeList(type("mainBanner")).title(title("메인 배너")).defaultOrdering([
            { field: "sortOrder", direction: "asc" },
            { field: "_createdAt", direction: "asc" },
          ])),
        ...(!suffix ? [S.listItem()
          .id(type("aboutSettings"))
          .title("ABOUT Settings")
          .child(
            S.document()
              .id(type("aboutSettings"))
              .schemaType(type("aboutSettings"))
              .documentId(type("aboutSettings"))
              .title(title("ABOUT Settings"))
          )] : []),
        ...magazinePostItems.filter((item) => !suffix || !["galleryPost", "playPost"].includes(item.type)).map((item) =>
          S.listItem()
            .id(type(item.id))
            .title(item.title)
            .child(
              S.documentTypeList(type(item.type))
                .title(title(item.title))
                .defaultOrdering([
                  { field: "publishedAt", direction: "desc" },
                  { field: "_createdAt", direction: "desc" },
                ])
            )
        ),
        ...(suffix ? [] : salonItems).map((item) =>
          S.listItem()
            .id(type(item.id))
            .title(item.title)
            .child(
              S.documentList()
                .id(type(item.id))
                .title(title(item.title))
                .schemaType(type("salonLocation"))
                .filter('_type == $type && region == $region')
                .params({ type: type("salonLocation"), region: item.region })
                .defaultOrdering([
                  { field: "order", direction: "asc" },
                  { field: "_createdAt", direction: "desc" },
                ])
                .initialValueTemplates([S.initialValueTemplateItem(suffix ? `salonLocationEn-${item.region}` : item.templateId)])
            )
        ),
      ];
};

export const deskStructure = (S) =>
  S.list().id("languageSelection").title("언어선택").items([
    S.listItem().id("ko").title("KR")
      .child(S.list().id("koContent").title("KR").items(languageItems(S))),
    S.listItem().id("en").title("EN")
      .child(S.list().id("enContent").title("EN").items(languageItems(S, "En"))),
  ]);
