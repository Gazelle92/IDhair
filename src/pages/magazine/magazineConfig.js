export const ROWS_PER_PAGE = 5;

export const magazinePageSettings = {
  "our-picks": { columns: 3, totalItems: 4 },
  "id-news": { columns: 3, totalItems: 40 },
  "id-event": { columns: 4, totalItems: 31 },
  "id-family": { columns: 2, totalItems: 24 },
  "id-gallery": { columns: 3, totalItems: 35 },
  "id-play": { columns: 2, totalItems: 24 },
};

export const getItemsPerPage = (category) => {
  const setting = magazinePageSettings[category] || magazinePageSettings["our-picks"];
  return setting.columns * ROWS_PER_PAGE;
};

export const getTotalPages = (category) => {
  const setting = magazinePageSettings[category] || magazinePageSettings["our-picks"];
  return Math.ceil(setting.totalItems / getItemsPerPage(category));
};

export const getPageItems = (items, currentPage, category) => {
  const itemsPerPage = getItemsPerPage(category);
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

  