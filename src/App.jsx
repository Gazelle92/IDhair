import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import AniProvider from "./components/AniProvider";

import Main from "./pages/Main";
import About from "./pages/About";
import "./styles/common.scss";
import LenisProvider from "./lib/Lenis";


function App() {
  return (
    <BrowserRouter>
    <LenisProvider />
    <AniProvider />
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </BrowserRouter>
  );
}


export default App;