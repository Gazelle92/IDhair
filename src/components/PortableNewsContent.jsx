import { getNewsImageUrl } from "../lib/sanityNews";

const getBlockText = (block) =>
  block.children
    ?.map((child) => child?.text || "")
    .join("")
    .trim() || "";

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
  const description = getBlockText(block);
  const fadeProps = {
    className: "fade-slice fadeX ani",
    "data-description": description,
  };

  if (block.listItem) {
    return <li key={key} {...fadeProps}>{children}</li>;
  }

  if (block.style === "h2") return <h2 key={key} {...fadeProps}>{children}</h2>;
  if (block.style === "h3") return <h3 key={key} {...fadeProps}>{children}</h3>;
  if (block.style === "blockquote") return <blockquote key={key} {...fadeProps}>{children}</blockquote>;

  return <p key={key} {...fadeProps}>{children}</p>;
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
