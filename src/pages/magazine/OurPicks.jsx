import { Link } from "react-router-dom";
import { getPageItems, magazinePageSettings, makeMagazineItems } from "./magazineConfig";

const CATEGORY = "our-picks";
const ITEMS = makeMagazineItems(
  CATEGORY,
  "Our PICKS layout",
  magazinePageSettings[CATEGORY].totalItems
);

function OurPicks({ currentPage = 1 }) {
  const pageItems = getPageItems(ITEMS, currentPage, CATEGORY);

  return (
    <ul className="mg_list mg_list_picks mg_list_new_post init_ani">
      {pageItems.map((item) => (
        <li className="mg_li sc_ani" key={item.id}>
          <Link to={`/magazine/${CATEGORY}/post-${item.id}`} className="mg_a">
            <span className="date txt-gray caption-m">{item.date}</span>
            <h1 className="body-m">{item.title}</h1>
            <img src={item.img} alt="Magazine Image" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default OurPicks;
