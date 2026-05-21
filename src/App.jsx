import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AniProvider from "./hook/Aniprovider";
import CursorFollower from "./hook/CursorFollower";
import useFadeSlice from "./hook/useFadeSlice";
import Main from "./pages/Main";
import About from "./pages/About";
import Magazine from "./pages/Magazine";
import MagazineDetail from "./pages/MagazineDetail";
import "./styles/common.scss";
import LenisProvider from "./lib/Lenis";


function App() {

  useFadeSlice();
  return (
    <BrowserRouter>
    <AniProvider />
    <LenisProvider />
    
    <CursorFollower />

      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/about" element={<About />} />
        <Route path="/magazine" element={<Navigate to="/magazine/our-picks" replace />} />
        <Route path="/magazine/:category" element={<Magazine />} />
        <Route path="/magazine/:category/post/:id" element={<MagazineDetail />} />
        <Route path="/magazine/:category/:pageSlug" element={<Magazine />} />
        <Route path="/magazine_detail" element={<MagazineDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}


export default App;
