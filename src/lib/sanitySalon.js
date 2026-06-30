import { sanityDataset, sanityProjectId, urlForSanityImage } from "./sanity";

const sanityQueryUrl = sanityProjectId
  ? `/sanity-data/query/${sanityDataset}`
  : "";

const regionLabels = {
  seoul: "서울",
  gyeonggi: "경기",
  local: "지방",
};

const regionOrder = ["seoul", "gyeonggi", "local"];

const runQuery = async (query) => {
  const searchParams = new URLSearchParams({ query });
  const response = await fetch(`${sanityQueryUrl}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Sanity salon request failed: ${response.status}`);
  }

  const data = await response.json();

  return data.result;
};

const getSalonImageUrl = (image) => {
  if (!image) return "/img/salon_1.jpg";

  return urlForSanityImage(image)
    .width(1600)
    .auto("format")
    .fit("crop")
    .url();
};

const toStore = (store) => ({
  id: store._id,
  name: store.name || "매장명 없음",
  address: store.address || "",
  phone: store.phone || "",
  hours: store.hours || "",
  off: store.off || "",
  instagramUrl: store.instagramUrl || "",
  reservationUrl: store.reservationUrl || "",
  images: (store.images || []).map(getSalonImageUrl),
});

export const fetchSalonRegions = async () => {
  const stores = await runQuery(`
    *[_type == "salonLocation" && (!defined(isHidden) || isHidden != true)]
      | order(order asc, _createdAt desc) {
        _id,
        name,
        region,
        address,
        phone,
        hours,
        off,
        instagramUrl,
        reservationUrl,
        images
      }
  `);

  return regionOrder.map((regionId) => ({
    id: regionId,
    name: regionLabels[regionId],
    stores: stores
      .filter((store) => store.region === regionId)
      .map(toStore),
  }));
};
