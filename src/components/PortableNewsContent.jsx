import { getNewsImageUrl } from "../lib/sanityNews";

const getBlockText = (block) =>
  block.children
    ?.map((child) => child?.text || "")
    .join("")
    .trim() || "";

const renderTextSpan = (child, markDefs = []) => {
  if (!child?.text) return null;

  const childKey = child._key || "span";
  let content = child.text.split("\n").map((line, index, lines) => (
    <span key={`${childKey}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));

  child.marks?.forEach((mark, index) => {
    const key = `${childKey}-${mark}-${index}`;

    if (mark === "strong") {
      content = <strong key={key}>{content}</strong>;
      return;
    }

    if (mark === "em") {
      content = <em key={key}>{content}</em>;
      return;
    }

    if (mark === "underline") {
      content = <u key={key}>{content}</u>;
      return;
    }

    const markDefinition = markDefs.find((definition) => definition._key === mark);

    if (markDefinition?._type === "link" && markDefinition.href) {
      const isExternal = /^https?:\/\//i.test(markDefinition.href);
      content = (
        <a
          key={key}
          href={markDefinition.href}
          {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {content}
        </a>
      );
    }
  });

  return <span key={childKey}>{content}</span>;
};

const renderBlock = (block) => {
  const children = block.children?.map((child) => renderTextSpan(child, block.markDefs));
  const key = block._key;
  const description = getBlockText(block);
  const hasInlineFormatting = block.children?.some((child) => child.marks?.length);
  const fadeProps = hasInlineFormatting
    ? {}
    : {
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
