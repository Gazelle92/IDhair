import { Link } from "react-router-dom";
import { getPageItems, magazinePageSettings, eventItems } from "./magazineConfig";

const CATEGORY = "id-event";
const ITEMS = eventItems(
  CATEGORY,
  "id EVENT layout",
  magazinePageSettings[CATEGORY].totalItems
);

function IdEvent({ currentPage = 1 }) {
  const pageItems = getPageItems(ITEMS, currentPage, CATEGORY);

  return (
    <ul className="mg_list mg_list_event init_ani">
      {pageItems.map((item) => (
        <li className="mg_li ani" key={item.id}>
          <Link to={`/magazine/${CATEGORY}/post/${item.id}`} className="mg_a">
            {/*<span className="date txt-gray caption-m">{item.date}</span>
            <h1 className="body-m">{item.title}</h1>*/}
            <img src={item.img} alt="Magazine Image" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default IdEvent;
