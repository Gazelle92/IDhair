import { useLocation } from "react-router-dom";
import TransitionLink from "../components/TransitionLink";
import "../styles/notfound.scss";

const copy = {
  ko: {
    title: "페이지를 찾을 수 없습니다",
    desc: "주소가 바뀌었거나 더 이상 없는 페이지입니다.",
    home: "메인으로",
    salon: "매장 찾기",
  },
  en: {
    title: "Page not found",
    desc: "The page may have moved or no longer exists.",
    home: "Home",
    salon: "Find a salon",
  },
};

// 목록에 없는 주소에서 보이는 화면. 검색 제외(noindex)는 App.jsx 에서 처리한다.
function NotFound() {
  const location = useLocation();
  const isEnglishPage = /^\/en(?:\/|$)/.test(location.pathname);
  const text = isEnglishPage ? copy.en : copy.ko;
  const prefix = isEnglishPage ? "/en" : "";

  return (
    <main className="page_notfound">
      <div className="notfound_inner">
        <p className="notfound_code apprael display-l">404</p>
        <h1 className="head-l fw-sb">{text.title}</h1>
        <p className="notfound_desc body-l txt-gray">{text.desc}</p>
        <div className="notfound_btns">
          <TransitionLink to={prefix || "/"} className="hover_btn body-m"><span>{text.home}</span></TransitionLink>
          <TransitionLink to={`${prefix}/salon`} className="hover_btn body-m"><span>{text.salon}</span></TransitionLink>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
