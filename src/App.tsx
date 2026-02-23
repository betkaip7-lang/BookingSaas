import { HashRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { SalonPage } from "./pages/SalonPage";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:salonSlug" element={<SalonPage />} />
      </Routes>
    </HashRouter>
  );
}
