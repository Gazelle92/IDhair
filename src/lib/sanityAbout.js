import { sanityDataset, sanityProjectId } from "./sanity";

const sanityQueryUrl = sanityProjectId
  ? `/sanity-data/query/${sanityDataset}`
  : "";

const runQuery = async (query) => {
  const searchParams = new URLSearchParams({ query });
  const response = await fetch(`${sanityQueryUrl}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Sanity request failed: ${response.status}`);
  }

  const data = await response.json();

  return data.result;
};

export const fetchAboutSettings = () =>
  runQuery(`*[_type == "aboutSettings"][0] {
    "introVideoUrl": introVideo.asset->url
  }`);
