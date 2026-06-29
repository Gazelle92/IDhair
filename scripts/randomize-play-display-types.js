import { getCliClient } from "sanity/cli";

const client = getCliClient({
  apiVersion: "2025-02-19",
}).withConfig({
  projectId: "9pry8zdk",
  dataset: "production",
});

const patterns = [
  ["type-a", "type-b", "type-b", "type-a", "type-a", "type-b", "type-a", "type-b"],
  ["type-b", "type-a", "type-b", "type-b", "type-a", "type-a", "type-b", "type-a"],
  ["type-a", "type-a", "type-b", "type-a", "type-b", "type-b", "type-a", "type-b"],
  ["type-b", "type-b", "type-a", "type-b", "type-a", "type-b", "type-a", "type-a"],
  ["type-a", "type-b", "type-a", "type-b", "type-b", "type-a", "type-b", "type-a"],
  ["type-b", "type-a", "type-a", "type-b", "type-a", "type-b", "type-b", "type-a"],
  ["type-a", "type-b", "type-b", "type-b", "type-a", "type-b", "type-a", "type-a"],
  ["type-b", "type-a", "type-b", "type-a", "type-b", "type-b", "type-a", "type-a"],
  ["type-a", "type-a", "type-b", "type-b", "type-a", "type-b", "type-b", "type-a"],
  ["type-b", "type-b", "type-a", "type-a", "type-b", "type-a", "type-b", "type-a"],
  ["type-a", "type-b", "type-a", "type-a", "type-b", "type-b", "type-a", "type-b"],
  ["type-b", "type-a", "type-b", "type-b", "type-b", "type-a", "type-a", "type-b"],
  ["type-a", "type-a", "type-a", "type-b", "type-a", "type-b", "type-b", "type-a"],
  ["type-b", "type-b", "type-b", "type-a", "type-b", "type-a", "type-a", "type-b"],
  ["type-a", "type-b", "type-b", "type-a", "type-b", "type-a", "type-a", "type-a"],
  ["type-b", "type-a", "type-a", "type-b", "type-a", "type-b", "type-b", "type-b"],
  ["type-a", "type-b", "type-a", "type-b", "type-a", "type-a", "type-b", "type-b"],
  ["type-b", "type-a", "type-b", "type-a", "type-b", "type-b", "type-a", "type-b"],
  ["type-a", "type-a", "type-b", "type-a", "type-a", "type-b", "type-b", "type-b"],
  ["type-b", "type-b", "type-a", "type-b", "type-b", "type-a", "type-a", "type-a"],
];

const main = async () => {
  const posts = await client.fetch(
    '*[_type == "playPost"] | order(publishedAt asc){_id, title, images[]{_key, displayType}}'
  );

  for (let index = 0; index < posts.length; index += 1) {
    const post = posts[index];
    const pattern = patterns[index % patterns.length];
    const patches = (post.images || []).map((image, imageIndex) => ({
      set: {
        [`images[_key == "${image._key}"].displayType`]: pattern[imageIndex % pattern.length],
      },
    }));

    let patch = client.patch(post._id);
    patches.forEach((operation) => {
      patch = patch.set(operation.set);
    });

    await patch.commit();
    console.log(`Updated ${post._id}: ${pattern.join(", ")}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
