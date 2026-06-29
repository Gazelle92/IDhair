import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getCliClient } from "sanity/cli";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const imageDir = path.join(rootDir, "public", "img");
const imageNames = [
  "mg_list_1.jpg",
  "mg_list_2.jpg",
  "mg_list_3.jpg",
  "mg_list_4.jpg",
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
    throw new Error(`Missing play image: ${filePath}`);
  }

  return client.assets.upload("image", fs.createReadStream(filePath), {
    filename: fileName,
  });
};

const imageField = (asset, key, displayType, alt) => ({
  _key: key,
  _type: "image",
  asset: {
    _type: "reference",
    _ref: asset._id,
  },
  displayType,
  alt,
});

const main = async () => {
  console.log("Uploading play assets...");
  const assets = [];

  for (const fileName of imageNames) {
    const asset = await uploadImage(fileName);
    assets.push(asset);
    console.log(`Uploaded ${fileName}: ${asset._id}`);
  }

  console.log("Creating play posts...");

  const baseDate = new Date("2026-06-29T00:00:00.000Z");

  for (let index = 0; index < 20; index += 1) {
    const postNumber = index + 1;
    const paddedPostNumber = String(postNumber).padStart(2, "0");
    const title = `Id Play ${postNumber}`;
    const publishedAt = new Date(baseDate.getTime() + index * 60 * 1000).toISOString();
    const images = Array.from({ length: 8 }, (_, imageIndex) => {
      const imageNumber = imageIndex + 1;
      const asset = assets[(index + imageIndex) % assets.length];
      const displayType = imageIndex % 2 === 0 ? "type-a" : "type-b";

      return imageField(
        asset,
        `image-${paddedPostNumber}-${String(imageNumber).padStart(2, "0")}`,
        displayType,
        `${title} ${imageNumber}`
      );
    });

    await client.createOrReplace({
      _id: `playPost-${paddedPostNumber}`,
      _type: "playPost",
      title,
      publishedAt,
      images,
      isHidden: false,
    });

    console.log(`Saved playPost-${paddedPostNumber}: ${title}`);
  }

  const count = await client.fetch('count(*[_type == "playPost" && !isHidden])');
  console.log(`Visible play posts: ${count}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
