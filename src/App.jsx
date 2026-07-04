import { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Layout from "./components/Layout";
import Home from "./pages/userside/Home";
import About from "./pages/userside/About";
import Services from "./pages/userside/Services";
import Portfolio from "./pages/userside/Portfolio";
import PortfolioSingle from "./pages/userside/PortfolioSingle";
import Testimonials from "./pages/userside/Testimonials";
import Contact from "./pages/userside/Contact";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  useEffect(() => {
    // Initialize AOS scroll animations
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<PortfolioSingle />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
