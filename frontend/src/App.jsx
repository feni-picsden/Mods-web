import React from "react";
import "./styles/App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Homepage";
import ModDetail from "./pages/ModDetail";
import ModsPage from "./pages/ModsPage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Contact from "./pages/Contact";
import InstallationSteps from "./pages/InstallationSteps";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
      <Router>
        <ScrollToTop />
    <div className="app">
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all" element={<ModsPage />} />
          <Route path="/all/:category" element={<ModsPage />} />
          <Route path="/all/:category/:modTitle" element={<ModDetail />} />
          <Route path="/mod/:id" element={<ModDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/installation-steps" element={<InstallationSteps />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      <Footer />
    </div>
      </Router>
  );
}

export default App;
