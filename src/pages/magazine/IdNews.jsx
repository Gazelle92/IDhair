import TransitionLink from "../../components/TransitionLink";
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
  const isFirstPage = currentPage === 1;
  const featuredItems = isFirstPage ? pageItems.slice(0, FEATURED_COUNT) : [];
  const normalItems = isFirstPage ? pageItems.slice(FEATURED_COUNT) : pageItems;

  return (
    <>
      {isFirstPage && (
        <ul className="mg_list mg_list_new_post init_ani">
          {featuredItems.map((item) => (
            <li className="mg_li ani" key={item.id}>
              <TransitionLink to={`/magazine/${CATEGORY}/post/${item.id}`} className="mg_a">
                <span className="date txt-gray caption-m">{item.date}</span>
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
              <span className="date txt-gray caption-m">{item.date}</span>
              <h1 className="body-m">{item.title}</h1>
              <img src={item.img} alt="Magazine Image" />
            </TransitionLink>
          </li>
        ))}
      </ul>
    </>
  );
}

export default IdNews;
