import { useEffect, useMemo, useState } from "react";
import TransitionLink from "../../components/TransitionLink";
import { fetchNewsPosts, formatNewsDate, getNewsImageUrl } from "../../lib/sanityNews";
import { getPageItems } from "./magazineConfig";

const CATEGORY = "id-news";
const FEATURED_COUNT = 4;

function IdNews({ currentPage = 1 }) {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetchNewsPosts()
      .then((items) => {
        if (!isMounted) return;

        setPosts(items);
        setStatus("ready");
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error("Failed to load Sanity news posts", error);
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
      date: formatNewsDate(post.publishedAt),
      title: post.title,
      img: getNewsImageUrl(post.thumbnail),
    })),
    [posts]
  );

  const pageItems = getPageItems(items, currentPage, CATEGORY);
  const isFirstPage = currentPage === 1;
  const featuredItems = isFirstPage ? pageItems.slice(0, FEATURED_COUNT) : [];
  const normalItems = isFirstPage ? pageItems.slice(FEATURED_COUNT) : pageItems;

  if (status === "loading") {
    return <div className="mg_state body-m">Loading...</div>;
  }

  if (status === "error") {
    return <div className="mg_state body-m">News posts could not be loaded. {errorMessage}</div>;
  }

  if (!items.length) {
    return <div className="mg_state body-m">No news posts yet.</div>;
  }

  return (
    <>
      {isFirstPage && (
        <ul className="mg_list mg_list_new_post init_ani">
          {featuredItems.map((item) => (
            <li className="mg_li ani" key={item.id}>
              <TransitionLink to={`/magazine/${CATEGORY}/post/${item.id}`} className="mg_a">
                <span className="date txt-gray body-m">{item.date}</span>
                <h1 className="body-m">{item.title}</h1>
                <img src={item.img} alt="Magazine Image" />
              </TransitionLink>
            </li>
          ))}
        </ul>
      )}

      <ul className="mg_list mg_list_news init_ani">
        {normalItems.map((item) => (
          <li className="mg_li ani" key={item.id}>
            <TransitionLink to={`/magazine/${CATEGORY}/post/${item.id}`} className="mg_a">
              <span className="date txt-gray body-l">{item.date}</span>
              <h1 className="body-l">{item.title}</h1>
              <img src={item.img} alt="Magazine Image" />
            </TransitionLink>
          </li>
        ))}
      </ul>
    </>
  );
}

export default IdNews;
