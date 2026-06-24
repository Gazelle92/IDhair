import { sanityDataset, sanityProjectId, urlForSanityImage } from "./sanity";

const newsFields = `
  _id,
  title,
  thumbnail,
  content,
  publishedAt,
  isHidden
`;

const newsOrder = "order(publishedAt desc, _createdAt desc)";
const sanityQueryUrl = sanityProjectId
  ? `/sanity-data/query/${sanityDataset}`
  : "";

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

export const fetchNewsPosts = () =>
  runQuery(
    `*[_type == "newsPost" && (!defined(isHidden) || isHidden != true)] | ${newsOrder} {
      ${newsFields}
    }`
  );

export const fetchNewsCount = () =>
  runQuery(`count(*[_type == "newsPost" && (!defined(isHidden) || isHidden != true)])`);

export const fetchNewsPost = (id) =>
  runQuery(
    `*[_type == "newsPost" && _id == $id][0] {
      ${newsFields}
    }`,
    { id }
  );
