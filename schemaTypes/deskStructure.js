const magazinePostItems = [
  { id: "newsPost", title: "id NEWS", type: "newsPost" },
  { id: "eventPost", title: "id EVENT", type: "eventPost" },
  { id: "familyPost", title: "id FAMILY", type: "familyPost" },
  { id: "galleryPost", title: "id GALLERY", type: "galleryPost" },
];

export const deskStructure = (S) =>
  S.list()
    .title("Content")
    .items(
      magazinePostItems.map((item) =>
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
      )
    );
