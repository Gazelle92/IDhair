import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AniProvider from "./components/Aniprovider";
import CursorFollower from "./components/CursorFollower";
import Main from "./pages/Main";
import About from "./pages/About";
import Magazine from "./pages/Magazine";
import MagazineDetail from "./pages/MagazineDetail";
import "./styles/common.scss";
import LenisProvider from "./lib/Lenis";


function App() {
  return (
    <BrowserRouter>
    <LenisProvider />
    <AniProvider />
    <CursorFollower />
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/about" element={<About />} />
        <Route path="/magazine" element={<Magazine />} />
        <Route path="/magazineDetail" element={<MagazineDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}


export default App;