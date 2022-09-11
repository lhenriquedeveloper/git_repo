import { BrowserRouter, Routes as Router, Route } from "react-router-dom";
import Main from "./pages/Main";
import Repository from "./pages/Repository";

export default function Routes() {
  return (
    <BrowserRouter>
      <Router>
        <Route path="/" element={<Main />} />
        <Route path="/repo/:repo" element={<Repository />} />
      </Router>
    </BrowserRouter>
  );
}
