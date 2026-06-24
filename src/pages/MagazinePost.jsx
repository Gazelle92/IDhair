import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TransitionLink from "../components/TransitionLink";
import PortableNewsContent from "../components/PortableNewsContent";
import { fetchNewsPost, formatNewsDate, getNewsImageUrl } from "../lib/sanityNews";
import "../styles/MagazinePost.scss";

function MagazinePost() {
  const { category = "our-picks", id } = useParams();
  const categoryNames = {
    "our-picks": "Our PICKS",
    "id-news": "id NEWS",
    "id-event": "id EVENT",
    "id-family": "id FAMILY",
    "id-gallery": "id GALLERY",
    "id-play": "id PLAY",
  };
  const listUrl = `/magazine/${category}`;
  const pageName = categoryNames[category] || categoryNames["our-picks"];
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState(category === "id-news" ? "loading" : "ready");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (category !== "id-news" || !id) {
      return undefined;
    }

    let isMounted = true;

    fetchNewsPost(id)
      .then((item) => {
        if (!isMounted) return;

        setPost(item);
        setStatus(item ? "ready" : "missing");
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error("Failed to load Sanity news post", error);
        setErrorMessage(error?.message || "Unknown error");
        setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, [category, id]);

  const isSanityNewsPost = category === "id-news" && id;

  if (isSanityNewsPost && status === "loading") {
    return (
      <main className="page_magazine_detail">
        <section className="md_head b-t b-4 ani">
          <div className="md_head_1 ani b-b b-delay-2">
            <TransitionLink className="fadeX-2" to={listUrl}><img src="/img/arrow_list_left.svg" alt="" /><span className="body-s">BACK</span></TransitionLink>
            <div className="page_name body-s fadeX-4">{pageName}</div>
          </div>
        </section>
        <section className="md_body"><div className="md_body_inner"><article>Loading...</article></div></section>
      </main>
    );
  }

  if (isSanityNewsPost && (status === "error" || status === "missing")) {
    return (
      <main className="page_magazine_detail">
        <section className="md_head b-t b-4 ani">
          <div className="md_head_1 ani b-b b-delay-2">
            <TransitionLink className="fadeX-2" to={listUrl}><img src="/img/arrow_list_left.svg" alt="" /><span className="body-s">BACK</span></TransitionLink>
            <div className="page_name body-s fadeX-4">{pageName}</div>
          </div>
        </section>
        <section className="md_body"><div className="md_body_inner"><article>{status === "error" ? `Post could not be loaded. ${errorMessage}` : "Post not found."}</article></div></section>
      </main>
    );
  }

  if (isSanityNewsPost && post) {
    return (
      <main className="page_magazine_detail">
        <section className="md_head b-t b-4 ani">
          <div className="md_head_1 ani b-b b-delay-2">
            <TransitionLink className="fadeX-2" to={listUrl}><img src="/img/arrow_list_left.svg" alt="" /><span className="body-s">BACK</span></TransitionLink>
            <div className="page_name body-s fadeX-4">{pageName}</div>
          </div>
          <div className="md_head_2 ani b-b b-delay-4">
            <h1 className="fade-cw head-l fw-sb"><span className="fadeX-1">{post.title}</span></h1>
            <span className="body-s txt-gray fade-cw"><span className="fadeX-2">{formatNewsDate(post.publishedAt)}</span></span>
          </div>
        </section>
        <section className="md_body">
          <div className="md_body_inner">
            <article>
              {post.thumbnail && <img className="ani fade-img" src={getNewsImageUrl(post.thumbnail, 1280)} alt="" />}
              <div className="fade-slice fadeX ani">
                <PortableNewsContent value={post.content} />
              </div>
            </article>
          </div>
        </section>
        <div className="md_body_b b-t ani">
          <TransitionLink to={listUrl}><img src="/img/icon_list.svg" alt="to list" /><span className="body-m">LIST</span></TransitionLink>
        </div>
      </main>
    );
  }

  return (
    <main className="page_magazine_detail">
      <section className="md_head b-t b-4 ani">
        <div className="md_head_1 ani b-b b-delay-2">
          <TransitionLink className="fadeX-2" to={listUrl}><img src="/img/arrow_list_left.svg" alt="" /><span className="body-s">BACK</span></TransitionLink>
          <div className="page_name body-s fadeX-4">{pageName}</div>
        </div>
        <div className="md_head_2 ani b-b b-delay-4">
          <h1 className="fade-cw head-l fw-sb"><span className="fadeX-1">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</span></h1>
          <span className="body-s txt-gray fade-cw"><span className="fadeX-2">2026.03.10</span></span>
        </div>
      </section>
      <section className="md_body">
        <div className="md_body_nav_w">
          <div className="md_body_nav head-s fw-sb   ani">
            <a className="fadeX-6" href="#">Prev.</a>
            <a className="fadeX-8" href="#">Next.</a>
          </div>
        </div>
        <div className="md_body_inner">
          <article>
            {/*<img className="ani fade-img" src="/img/mg_list_2.jpg" alt="Magazine Image" />*/}
            <div className="fade-slice fadeX ani">
              이번 캠페인은 id HAIR가 추구하는 ‘대중적인 프리미엄’의 새로운 기준을 시각적으로 제안하는 프로젝트입니다.<br/>
              단순히 스타일 결과를 보여주는 것을 넘어, 고객이 브랜드를 경험하는 모든 순간에 자연스럽게 스며드는 감도와 태도를 하나의 비주얼 언어로 풀어냈습니다.<br/><br/>

              이번 시즌은 도시적이고 세련된 무드, 절제된 프리미엄, 그리고 현장감 있는 리얼리티를 핵심 키워드로 설정했습니다.<br/>
              살롱 공간의 결, 디자이너의 손끝 움직임, 고객과의 교감, 그리고 스타일이 완성되는 순간의 긴장감까지 브랜드가 가진 본질적인 아름다움을 섬세하게 담아냈습니다.<br/><br/>

              특히 이번 캠페인에서는 기존의 정적인 이미지 중심 표현에서 확장하여, 부분적인 움직임이 살아있는 비주얼 컷과 무드 필름 형식의 영상 콘텐츠를 함께 활용했습니다.<br/>
              이를 통해 id HAIR만의 헤리티지와 동시대적인 트렌드 감각이 자연스럽게 공존하는 방향성을 제시합니다.<br/><br/>

              브랜드의 36년 DNA를 기반으로, 이번 프로젝트는 단순한 시즌 룩 제안이 아닌 살롱이 고객과 관계를 맺는 방식, 디자이너가 무드를 설계하는 방식, 그리고 스타일이 라이프스타일로 확장되는 과정까지 하나의 스토리로 연결합니다.
            </div>
            <img className="ani fade-img" src="/img/mg_list_3.jpg" alt="Magazine Image" />
            <div className="fade-slice fadeX ani">
              캠페인 전반에는 절제된 타이포그래피와 여백 중심의 레이아웃, 뉴트럴 톤 기반의 컬러 시스템, 그리고 감정선을 살리는 인물 중심 컷을 적용하여 브랜드가 지향하는 프리미엄 무드를 보다 직관적으로 경험할 수 있도록 구성했습니다.<br/><br/>

              앞으로도 id HAIR는 브랜드 캠페인을 통해 트렌드를 단순히 따라가는 것이 아닌, 현장에서 시작된 감각을 브랜드의 언어로 재해석하여 새로운 스타일 문화를 제안해 나갈 예정입니다.
            </div>
          </article>
          
        </div>
        
      </section>
      <div className="md_body_b b-t ani">
        <TransitionLink to={listUrl}><img src="/img/icon_list.svg" alt="to list" /><span className="body-m">LIST</span></TransitionLink>
      </div>
      
    </main>
  );
}

export default MagazinePost;
