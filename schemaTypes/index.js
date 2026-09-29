import aboutSettings from "./aboutSettings";
import mainBanner from "./mainBanner";
import eventPost from "./eventPost";
import familyPost from "./familyPost";
import galleryPost from "./galleryPost";
import newsPost from "./newsPost";
import playPost from "./playPost";
import salonLocation from "./salonLoca";

const koreanSchemaTypes = [mainBanner, aboutSettings, newsPost, eventPost, familyPost, galleryPost, playPost, salonLocation];

// Share field definitions, but store English content as separate document types.
const englishSchemaTypes = koreanSchemaTypes.map((schema) => ({
  ...schema,
  name: `${schema.name}En`,
  title: `${schema.title} (EN)`,
}));

export const schemaTypes = [...koreanSchemaTypes, ...englishSchemaTypes];
