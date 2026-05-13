import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Main from "./pages/Main";
import About from "./pages/About";
import "./styles/common.scss";


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </BrowserRouter>
  );
}


export default App;