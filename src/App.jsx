import { lazy, Suspense, useEffect, useState } from "react";
import { getPageTitle } from "./data/pageTitles";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AniProvider from "./hook/Aniprovider";
import CursorFollower from "./hook/CursorFollower";
import useFadeSlice from "./hook/useFadeSlice";
import Main from "./pages/Main";
import MainEn from "./pagesEn/Main";
import AboutEn from "./pagesEn/About";
import AcademyEn from "./pagesEn/Academy";
import RecruitEn from "./pagesEn/Recruit";
import MagazineEn from "./pagesEn/Magazine";
import MagazinePostEn from "./pagesEn/MagazinePost";
import About from "./pages/About";
import Academy from "./pages/Academy";
import Recruit from "./pages/Recruit";
import Magazine from "./pages/Magazine";
import MagazineDetail from "./pages/MagazinePost";
import "./styles/common.scss";
import LenisProvider from "./lib/Lenis";

const AdminStudio = lazy(() => import("./pages/AdminStudio"));

function FadeSliceProvider() {
  useFadeSlice();
  return null;
}

function AppRoutes() {
  const location = useLocation();
  const [salonOpen, setSalonOpen] = useState(false);
  const isAdminRoute = location.pathname.startsWith("/admin");
  useEffect(() => {
    if (isAdminRoute) return;
    const title = getPageTitle(location.pathname);
    document.title = title;
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://www.idhair.com${location.pathname}`);
  }, [location.pathname, isAdminRoute]);

  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="admin_studio_loading">Loading Studio...</div>}>
        <Routes>
          <Route path="/admin/*" element={<AdminStudio />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      <FadeSliceProvider />
      <AniProvider />
      <LenisProvider />

      <CursorFollower />

      <Header salonOpen={salonOpen} setSalonOpen={setSalonOpen} />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/en" element={<MainEn />} />
        <Route path="/en/about" element={<AboutEn />} />
        <Route path="/en/academy" element={<AcademyEn />} />
        <Route path="/en/recruit" element={<RecruitEn />} />
        <Route path="/en/magazine" element={<Navigate to="/en/magazine/our-picks" replace />} />
        <Route path="/en/magazine/:category" element={<MagazineEn />} />
        <Route path="/en/magazine/:category/post/:id" element={<MagazinePostEn />} />
        <Route path="/en/magazine/:category/:pageSlug" element={<MagazineEn />} />
        <Route path="/en/magazine-post" element={<MagazinePostEn />} />
        <Route path="/about" element={<About />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/recruit" element={<Recruit />} />
        <Route path="/magazine" element={<Navigate to="/magazine/our-picks" replace />} />
        <Route path="/magazine/:category" element={<Magazine />} />
        <Route path="/magazine/:category/post/:id" element={<MagazineDetail />} />
        <Route path="/magazine/:category/:pageSlug" element={<Magazine />} />
        <Route path="/magazine-post" element={<MagazineDetail />} />
      </Routes>
      <Footer onOpenSalon={() => setSalonOpen(true)} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}


export default App;
