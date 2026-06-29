import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityProjectId = import.meta.env.VITE_SANITY_PROJECT_ID || "9pry8zdk";
export const sanityDataset = import.meta.env.VITE_SANITY_DATASET || "production";

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: "2025-02-19",
  useCdn: true,
  perspective: "published",
});

const imageBuilder = imageUrlBuilder(sanityClient);

export const urlForSanityImage = (source) => imageBuilder.image(source);

export const getSanityDocumentCount = () => sanityClient.fetch("count(*)");
