import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import AniProvider from "./components/Aniprovider";
import CursorFollower from "./components/CursorFollower";
import Main from "./pages/Main";
import About from "./pages/About";
import Magazine from "./pages/Magazine";
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
      </Routes>
    </BrowserRouter>
  );
}


export default App;