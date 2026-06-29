import { getCliClient } from "sanity/cli";

const client = getCliClient({
  apiVersion: "2025-02-19",
}).withConfig({
  projectId: "9pry8zdk",
  dataset: "production",
});

const main = async () => {
  const posts = await client.fetch(
    '*[_type == "galleryPost"] | order(publishedAt desc, _createdAt desc){_id, title}'
  );

  for (let index = 0; index < posts.length; index += 1) {
    const post = posts[index];
    const content = `나다움을 마주하는 계절의 시작 ${index + 1}`;

    await client.patch(post._id).set({ content }).commit();
    console.log(`Updated ${post._id}: ${content}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
