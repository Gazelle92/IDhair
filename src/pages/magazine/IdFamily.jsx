import { useEffect, useMemo, useState } from "react";
import TransitionLink from "../../components/TransitionLink";
import { fetchMagazinePosts, getNewsImageUrl } from "../../lib/sanityNews";
import { getPageItems } from "./magazineConfig";

const CATEGORY = "id-family";

function IdFamily({ currentPage = 1 }) {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetchMagazinePosts(CATEGORY)
      .then((items) => {
        if (!isMounted) return;

        setPosts(items);
        setStatus("ready");
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error("Failed to load Sanity family posts", error);
        setErrorMessage(error?.message || "Unknown error");
        setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const items = useMemo(
    () => posts.map((post) => ({
      id: post._id,
      title: post.title,
      img: getNewsImageUrl(post.thumbnail, 1200),
    })),
    [posts]
  );

  const pageItems = getPageItems(items, currentPage, CATEGORY);

  if (status === "loading") {
    return <div className="mg_state body-m loading"></div>;
  }

  if (status === "error") {
    return <div className="mg_state body-m">Family posts could not be loaded. {errorMessage}</div>;
  }

  if (!items.length) {
    return <div className="mg_state body-m">No family posts yet.</div>;
  }

  return (
    <ul className="mg_list mg_list_family init_ani">
      {pageItems.map((item) => (
        <li className="mg_li ani" key={item.id}>
          <TransitionLink to={`/magazine/${CATEGORY}/post/${item.id}`} className="mg_a">
            {/*<span className="date txt-gray caption-m">{item.date}</span>
            <h1 className="body-m">{item.title}</h1>*/}
            <img src={item.img} alt={item.title || "Magazine Image"} />
          </TransitionLink>
        </li>
      ))}
    </ul>
  );
}

export default IdFamily;
