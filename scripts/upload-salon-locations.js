import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const imageDir = path.join(rootDir, "public", "img");

const imageNames = ["salon_1.jpg", "salon_2.jpg", "salon_3.jpg", "salon_4.jpg", "salon_5.jpg"];

const regions = [
  { key: "seoul", label: "서울", phonePrefix: "02" },
  { key: "gyeonggi", label: "경기", phonePrefix: "031" },
  { key: "local", label: "지방", phonePrefix: "051" },
];

const linkPatterns = [
  {
    instagramUrl: "https://www.instagram.com/",
    reservationUrl: "https://booking.naver.com/",
  },
  {
    reservationUrl: "https://booking.naver.com/",
  },
  {
    instagramUrl: "https://www.instagram.com/",
  },
];

const client = process.env.SANITY_AUTH_TOKEN
  ? createClient({
      projectId: "9pry8zdk",
      dataset: "production",
      apiVersion: "2025-02-19",
      token: process.env.SANITY_AUTH_TOKEN,
      useCdn: false,
    })
  : getCliClient({
      apiVersion: "2025-02-19",
    }).withConfig({
      projectId: "9pry8zdk",
      dataset: "production",
    });

const uploadImage = async (fileName) => {
  const filePath = path.join(imageDir, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing salon image: ${filePath}`);
  }

  return client.assets.upload("image", fs.createReadStream(filePath), {
    filename: fileName,
  });
};

const imageField = (asset, key, alt) => ({
  _key: key,
  _type: "image",
  asset: {
    _type: "reference",
    _ref: asset._id,
  },
  alt,
});

const main = async () => {
  console.log("Uploading salon assets...");
  const assets = [];

  for (const fileName of imageNames) {
    const asset = await uploadImage(fileName);
    assets.push(asset);
    console.log(`Uploaded ${fileName}: ${asset._id}`);
  }

  console.log("Creating salon locations...");

  for (const [regionIndex, region] of regions.entries()) {
    for (let index = 0; index < 3; index += 1) {
      const number = index + 1;
      const idNumber = String(number).padStart(2, "0");
      const links = linkPatterns[index];
      const images = Array.from({ length: 3 }, (_, imageIndex) => {
        const asset = assets[(index + imageIndex + regionIndex) % assets.length];

        return imageField(
          asset,
          `${region.key}-${idNumber}-image-${imageIndex + 1}`,
          `${region.label} ${number} 이미지 ${imageIndex + 1}`
        );
      });

      await client.createOrReplace({
        _id: `salonLocation-${region.key}-${idNumber}`,
        _type: "salonLocation",
        name: `${region.label} ${number}`,
        region: region.key,
        address: `${region.label} 주소 ${number}`,
        phone: `${region.phonePrefix}-0000-000${number}`,
        hours: "10:00 - 21:30",
        off: "매주 화요일 휴무",
        ...links,
        images,
        order: number,
        isHidden: false,
      });

      console.log(`Saved ${region.label} ${number}`);
    }
  }

  const summary = await client.fetch(
    '*[_type == "salonLocation"] | order(region asc, order asc) {name, region, order, instagramUrl, reservationUrl}'
  );
  console.log(JSON.stringify(summary, null, 2));
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
