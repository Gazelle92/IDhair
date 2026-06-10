export const ROWS_PER_PAGE = 5;

export const magazinePageSettings = {
  "our-picks": { columns: 3, totalItems: 4 },
  "id-news": { columns: 3, totalItems: 40, firstPageItems: 13 },
  "id-event": { columns: 4, totalItems: 31 },
  "id-family": { columns: 2, totalItems: 24 },
  "id-gallery": { columns: 3, totalItems: 35, firstPageItems: 7 },
  "id-play": { columns: 2, totalItems: 24, itemsPerPage: 9 },
};

export const getItemsPerPage = (category) => {
  const setting = magazinePageSettings[category] || magazinePageSettings["our-picks"];
  if (setting.itemsPerPage) return setting.itemsPerPage;

  return setting.columns * ROWS_PER_PAGE;
};

export const getTotalPages = (category) => {
  const setting = magazinePageSettings[category] || magazinePageSettings["our-picks"];
  const itemsPerPage = getItemsPerPage(category);

  if (setting.firstPageItems) {
    const remainingItems = Math.max(setting.totalItems - setting.firstPageItems, 0);
    return 1 + Math.ceil(remainingItems / itemsPerPage);
  }

  return Math.ceil(setting.totalItems / getItemsPerPage(category));
};

export const getPageItems = (items, currentPage, category) => {
  const setting = magazinePageSettings[category] || magazinePageSettings["our-picks"];
  const itemsPerPage = getItemsPerPage(category);

  if (setting.firstPageItems) {
    if (currentPage === 1) {
      return items.slice(0, setting.firstPageItems);
    }

    const startIndex = setting.firstPageItems + (currentPage - 2) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  return items.slice(startIndex, startIndex + itemsPerPage);
};

export const makeMagazineItems = (category, title, totalItems) =>
  Array.from({ length: totalItems }, (_, index) => {
    const id = index + 1;

    return {
      id,
      category,
      date: "2026.03.10",
      title: `${title} ${id}`,
      img: `/img/mg_list_${(index % 4) + 1}.jpg`,
    };
  });

export const playItems = (category, title, totalItems) =>
  Array.from({ length: totalItems }, (_, index) => {
    const id = index + 1;

    return {
      id,
      category,
      date: "2026.03.10",
      title: `${title} ${id}`,
      img: `/img/mg_list_${(index % 4) + 1}.jpg`,
      images: Array.from({ length: 8 }, (_, imageIndex) => {
        const imageId = imageIndex + 1;

        return {
          id: `${id}-${imageId}`,
          parentId: id,
          category,
          date: "2026.03.10",
          title: `${title} ${id}`,
          img: `/img/mg_list_${((index + imageIndex) % 4) + 1}.jpg`,
        };
      }),
    };
  });


  export const familyItems = (category, title, totalItems) =>
  Array.from({ length: totalItems }, (_, index) => {
    const id = index + 1;

    return {
      id,
      category,
      date: "2026.03.10",
      title: `${title} ${id}`,
      img: `/img/mg_list_fa_${(index % 2) + 1}.jpg`,
    };
  });

    export const eventItems = (category, title, totalItems) =>
  Array.from({ length: totalItems }, (_, index) => {
    const id = index + 1;

    return {
      id,
      category,
      date: "2026.03.10",
      title: `${title} ${id}`,
      img: `/img/mg_list_event_${(index % 4) + 1}.jpg`,
    };
  });


  const galleryTitles = [
    "S/S Collection1",
    "S/S Collection2",
    "S/S Collection3",
    "S/S Collection4",
    "S/S Collection5",
  ];

  export const galleryItems = (category, title, totalItems) =>
  Array.from({ length: totalItems }, (_, index) => {
    const id = index + 1;
    const year = 2026 - index;
    const itemTitle = galleryTitles[index % galleryTitles.length];

    return {
      id,
      category,
      date: `${year}`,
      title: itemTitle,
      img: `/img/mg_list_ga_${(index % 5) + 1}.jpg`,
      images: Array.from({ length: 10 }, (_, imageIndex) => {
        const imageId = imageIndex + 1;

        return {
          id: `${id}-${imageId}`,
          parentId: id,
          category,
          date: `${year}`,
          title: `${itemTitle}`,
          img: `/img/mg_list_ga_${((index + imageIndex) % 5) + 1}.jpg`,
        };
      }),
    };
  });

  
