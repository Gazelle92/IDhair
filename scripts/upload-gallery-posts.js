import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getCliClient } from "sanity/cli";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const imageDir = path.join(rootDir, "public", "img");
const imageNames = [
  "mg_list_ga_1.jpg",
  "mg_list_ga_2.jpg",
  "mg_list_ga_3.jpg",
  "mg_list_ga_4.jpg",
  "mg_list_ga_5.jpg",
];
const galleryTitles = [
  "S/S Collection1",
  "S/S Collection2",
  "S/S Collection3",
  "S/S Collection4",
  "S/S Collection5",
];

const client = getCliClient({
  apiVersion: "2025-02-19",
}).withConfig({
  projectId: "9pry8zdk",
  dataset: "production",
});

const uploadImage = async (fileName) => {
  const filePath = path.join(imageDir, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing gallery image: ${filePath}`);
  }

  return client.assets.upload("image", fs.createReadStream(filePath), {
    filename: fileName,
  });
};

const imageField = (asset, key, caption) => ({
  _key: key,
  _type: "image",
  asset: {
    _type: "reference",
    _ref: asset._id,
  },
  alt: caption,
  caption,
});

const main = async () => {
  console.log("Uploading gallery assets...");
  const assets = [];

  for (const fileName of imageNames) {
    const asset = await uploadImage(fileName);
    assets.push(asset);
    console.log(`Uploaded ${fileName}: ${asset._id}`);
  }

  console.log("Creating gallery posts...");

  for (let index = 0; index < 35; index += 1) {
    const number = String(index + 1).padStart(2, "0");
    const title = galleryTitles[index % galleryTitles.length];
    const year = 2026 - index;
    const thumbnailAsset = assets[index % assets.length];
    const images = Array.from({ length: 10 }, (_, imageIndex) => {
      const asset = assets[(index + imageIndex) % assets.length];
      const imageNumber = imageIndex + 1;

      return imageField(
        asset,
        `image-${number}-${String(imageNumber).padStart(2, "0")}`,
        `${title} ${imageNumber}`
      );
    });

    await client.createOrReplace({
      _id: `galleryPost-${number}`,
      _type: "galleryPost",
      title,
      publishedAt: `${year}-01-01T00:00:00.000Z`,
      thumbnail: imageField(thumbnailAsset, `thumbnail-${number}`, `${title} thumbnail`),
      images,
      isHidden: false,
    });

    console.log(`Saved galleryPost-${number}: ${title}`);
  }

  const count = await client.fetch('count(*[_type == "galleryPost" && !isHidden])');
  console.log(`Visible gallery posts: ${count}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
