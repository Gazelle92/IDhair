import { getNewsImageUrl } from "../lib/sanityNews";

const renderTextSpan = (child) => {
  if (!child?.text) return null;

  return child.text.split("\n").map((line, index, lines) => (
    <span key={`${child._key || "span"}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
};

const renderBlock = (block) => {
  const children = block.children?.map(renderTextSpan);
  const key = block._key;

  if (block.listItem) {
    return <li key={key}>{children}</li>;
  }

  if (block.style === "h2") return <h2 key={key}>{children}</h2>;
  if (block.style === "h3") return <h3 key={key}>{children}</h3>;
  if (block.style === "blockquote") return <blockquote key={key}>{children}</blockquote>;

  return <p key={key}>{children}</p>;
};

function PortableNewsContent({ value = [] }) {
  if (!value.length) return null;

  return value.map((block) => {
    if (block._type === "image") {
      return (
        <figure className="news_content_image" key={block._key}>
          <img className="ani fade-img" src={getNewsImageUrl(block, 1280)} alt={block.alt || ""} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    }

    if (block._type === "block") {
      return renderBlock(block);
    }

    return null;
  });
}

export default PortableNewsContent;
