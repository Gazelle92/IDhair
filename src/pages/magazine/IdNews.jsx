import { Link } from "react-router-dom";
import { getPageItems, magazinePageSettings, makeMagazineItems } from "./magazineConfig";

const CATEGORY = "id-news";
const FEATURED_COUNT = 4;
const ITEMS = makeMagazineItems(
  CATEGORY,
  "id NEWS layout",
  magazinePageSettings[CATEGORY].totalItems
);

function IdNews({ currentPage = 1 }) {
  const pageItems = getPageItems(ITEMS, currentPage, CATEGORY);
  const featuredItems = pageItems.slice(0, FEATURED_COUNT);
  const normalItems = pageItems.slice(FEATURED_COUNT);

  return (
    <>
      <ul className="mg_list mg_list_new_post init_ani">
        {featuredItems.map((item) => (
          <li className="mg_li ani" key={item.id}>
            <Link to={`/magazine/${CATEGORY}/post-${item.id}`} className="mg_a">
              <span className="date txt-gray caption-m">{item.date}</span>
              <h1 className="body-m">{item.title}</h1>
              <img src={item.img} alt="Magazine Image" />
            </Link>
          </li>
        ))}
      </ul>

      <ul className="mg_list mg_list_news init_ani">
        {normalItems.map((item) => (
          <li className="mg_li ani" key={item.id}>
            <Link to={`/magazine/${CATEGORY}/post-${item.id}`} className="mg_a">
              <span className="date txt-gray caption-m">{item.date}</span>
              <h1 className="body-m">{item.title}</h1>
              <img src={item.img} alt="Magazine Image" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default IdNews;
