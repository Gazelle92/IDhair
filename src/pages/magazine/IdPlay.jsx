import TransitionLink from "../../components/TransitionLink";
import { getPageItems, magazinePageSettings, makeMagazineItems } from "./magazineConfig";

const CATEGORY = "id-play";
const ITEMS = makeMagazineItems(
  CATEGORY,
  "id PLAY layout",
  magazinePageSettings[CATEGORY].totalItems
);

function IdPlay({ currentPage = 1 }) {
  const pageItems = getPageItems(ITEMS, currentPage, CATEGORY);

  return (
    <ul className="mg_list mg_list_play init_ani">
      {pageItems.map((item) => (
        <li className="mg_li sc_ani" key={item.id}>
          <TransitionLink to={`/magazine/${CATEGORY}/post/${item.id}`} className="mg_a">
            <span className="date txt-gray caption-m">{item.date}</span>
            <h1 className="body-m">{item.title}</h1>
            <img src={item.img} alt="Magazine Image" />
          </TransitionLink>
        </li>
      ))}
    </ul>
  );
}

export default IdPlay;
