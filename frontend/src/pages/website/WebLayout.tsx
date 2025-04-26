import React from "react";
import Navbar from "./Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Events from "./Events";
import Contact from "./Contact";
import Footer from "./Footer";

export default function WebLayout() {
  return (
    <div className="flex flex-col h-screen px-0 mx-0 max-w-screen">
      <Navbar />
      <Home />
      <About />
      <Events />
      <Contact />
      <Footer />
    </div>
  );
}
