import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AniProvider from "./hook/Aniprovider";
import CursorFollower from "./hook/CursorFollower";
import useFadeSlice from "./hook/useFadeSlice";
import Main from "./pages/Main";
import About from "./pages/About";
import Academy from "./pages/Academy";
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
  const isAdminRoute = location.pathname.startsWith("/admin");

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

      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/about" element={<About />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/magazine" element={<Navigate to="/magazine/our-picks" replace />} />
        <Route path="/magazine/:category" element={<Magazine />} />
        <Route path="/magazine/:category/post/:id" element={<MagazineDetail />} />
        <Route path="/magazine/:category/:pageSlug" element={<Magazine />} />
        <Route path="/magazine-post" element={<MagazineDetail />} />
      </Routes>
      <Footer />
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
