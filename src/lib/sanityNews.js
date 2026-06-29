import { sanityDataset, sanityProjectId, urlForSanityImage } from "./sanity";

const postTypesByCategory = {
  "id-news": "newsPost",
  "id-event": "eventPost",
  "id-family": "familyPost",
  "id-gallery": "galleryPost",
  "id-play": "playPost",
};

const magazinePostFields = `
  _id,
  title,
  thumbnail,
  content,
  publishedAt,
  isHidden
`;

const galleryPostFields = `
  _id,
  title,
  thumbnail,
  images,
  publishedAt,
  isHidden
`;

const playPostFields = `
  _id,
  title,
  images,
  publishedAt,
  isHidden
`;

const magazinePostOrder = "order(publishedAt desc, _createdAt desc)";
const sanityQueryUrl = sanityProjectId
  ? `/sanity-data/query/${sanityDataset}`
  : "";

export const getPostTypeForCategory = (category) => postTypesByCategory[category];

const runQuery = async (query, params = {}) => {
  const searchParams = new URLSearchParams({ query });

  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(`$${key}`, JSON.stringify(value));
  });

  const response = await fetch(`${sanityQueryUrl}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Sanity request failed: ${response.status}`);
  }

  const data = await response.json();

  return data.result;
};

export const formatNewsDate = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

export const getNewsImageUrl = (image, width = 960) => {
  if (!image) return "/img/mg_list_1.jpg";

  return urlForSanityImage(image)
    .width(width)
    .auto("format")
    .fit("crop")
    .url();
};

export const formatGalleryDate = (dateValue) => {
  if (!dateValue) return "";

  return String(new Date(dateValue).getFullYear());
};

export const fetchNewsPosts = () =>
  fetchMagazinePosts("id-news");

export const fetchMagazinePosts = (category) => {
  const postType = getPostTypeForCategory(category);

  if (!postType) return Promise.resolve([]);

  return runQuery(
    `*[_type == $postType && (!defined(isHidden) || isHidden != true)] | ${magazinePostOrder} {
      ${magazinePostFields}
    }`,
    { postType }
  );
};

export const fetchGalleryPosts = () =>
  runQuery(
    `*[_type == "galleryPost" && (!defined(isHidden) || isHidden != true)] | ${magazinePostOrder} {
      ${galleryPostFields}
    }`
  );

export const fetchPlayPosts = () =>
  runQuery(
    `*[_type == "playPost" && (!defined(isHidden) || isHidden != true)] | ${magazinePostOrder} {
      ${playPostFields}
    }`
  );

export const fetchNewsCount = () =>
  fetchMagazinePostCount("id-news");

export const fetchMagazinePostCount = (category) => {
  const postType = getPostTypeForCategory(category);

  if (!postType) return Promise.resolve(0);

  return runQuery(`count(*[_type == $postType && (!defined(isHidden) || isHidden != true)])`, { postType });
};

export const fetchNewsPost = (id) =>
  fetchMagazinePost("id-news", id);

export const fetchMagazinePost = (category, id) => {
  const postType = getPostTypeForCategory(category);

  if (!postType) return Promise.resolve(null);

  return runQuery(
    `*[_type == $postType && _id == $id][0] {
      ${magazinePostFields}
    }`,
    { postType, id }
  );
};
