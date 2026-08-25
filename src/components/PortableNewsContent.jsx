import { Fragment } from "react";
import { getNewsImageUrl } from "../lib/sanityNews";

const getBlockText = (block) =>
  block.children
    ?.map((child) => child?.text || "")
    .join("")
    .trim() || "";

const renderTextChild = (child, markDefs = []) => {
  if (!child?.text) return null;

  const childKey = child._key || "span";
  const lines = child.text.split("\n");
  let content = lines.flatMap((line, index) => (
    index < lines.length - 1
      ? [line, <br key={`${childKey}-br-${index}`} />]
      : [line]
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

  return <Fragment key={childKey}>{content}</Fragment>;
};

const renderBlock = (block) => {
  const children = block.children?.map((child) => renderTextChild(child, block.markDefs));
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
      return getBlockText(block) ? renderBlock(block) : <br key={block._key} />;
    }

    return null;
  });
}

export default PortableNewsContent;
