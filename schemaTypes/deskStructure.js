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
];

export const deskStructure = (S) =>
  S.list()
    .title("Content")
    .items(
      [
        ...magazinePostItems.map((item) =>
          S.listItem()
            .id(item.id)
            .title(item.title)
            .child(
              S.documentTypeList(item.type)
                .title(item.title)
                .defaultOrdering([
                  { field: "publishedAt", direction: "desc" },
                  { field: "_createdAt", direction: "desc" },
                ])
            )
        ),
        ...salonItems.map((item) =>
          S.listItem()
            .id(item.id)
            .title(item.title)
            .child(
              S.documentList()
                .id(item.id)
                .title(item.title)
                .schemaType("salonLocation")
                .filter('_type == "salonLocation" && region == $region')
                .params({ region: item.region })
                .defaultOrdering([
                  { field: "order", direction: "asc" },
                  { field: "_createdAt", direction: "desc" },
                ])
                .initialValueTemplates([S.initialValueTemplateItem(item.templateId)])
            )
        ),
      ]
    );
