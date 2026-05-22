import TransitionLink from "../../components/TransitionLink";
import { getPageItems, magazinePageSettings, galleryItems } from "./magazineConfig";

const CATEGORY = "id-gallery";
const ITEMS = galleryItems(
  CATEGORY,
  "id GALLERY layout",
  magazinePageSettings[CATEGORY].totalItems
);

function IdGallery({ currentPage = 1 }) {
  const pageItems = getPageItems(ITEMS, currentPage, CATEGORY);
  const isFirstPage = currentPage === 1;
  const featuredItem = isFirstPage ? pageItems[0] : null;
  const normalItems = isFirstPage ? pageItems.slice(1) : pageItems;

  return (
    <>
      {featuredItem && (
        <ul className="mg_list mg_list_gallery_featured">
          <li className="mg_li ani" key={featuredItem.id}>
            <TransitionLink to={`/magazine/${CATEGORY}/post/${featuredItem.id}`} className="mg_a">
              <h1 className="display-m text-effect apprael_all ani" data-splitting data-effect17>
                <span>{featuredItem.date} </span>
                <span>{featuredItem.title}</span>
              </h1>
              <img className="bg" src={featuredItem.img} alt="Magazine Image" />
              <div className="bg_blur"></div>
              <img className="thumb" src={featuredItem.img} alt="Magazine Image" />
            </TransitionLink>
          </li>
        </ul>
      )}

      <ul className="mg_list mg_list_gallery init_ani">
        {normalItems.map((item) => (
          <li className="mg_li ani" key={item.id}>
            <TransitionLink to={`/magazine/${CATEGORY}/post/${item.id}`} className="mg_a">
              <h1 className="body-m">{item.title}</h1>
              <img src={item.img} alt="Magazine Image" />
            </TransitionLink>
          </li>
        ))}
      </ul>
    </>
  );
}

export default IdGallery;
