"use client";

import React, { useState } from "react";

const FigmaHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: "About", href: "#about" },
    { name: "Contract", href: "#contract" },
    { name: "Tokenomics", href: "#tokenomics" },
    { name: "How to buy", href: "#buy" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    // Smooth scroll to section
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4">
        <div className="flex w-full h-auto px-6 py-3.5 items-center justify-between relative rounded-full border-2 border-black bg-duis shadow-[6px_6px_0_0_#000] backdrop-blur-md">
          {/* Logo Section */}
          <div className="flex justify-end items-center gap-2 relative">
            <img
              className="w-10 h-10 rounded-full border-2 border-black shadow-sm"
              src="https://api.builder.io/api/v1/image/assets/TEMP/c274d09705f223b4e11ce1e0489b8ddb01ef50f5?width=80"
              alt="MOMO Icon"
            />
            <div className="flex pb-0.5 flex-col items-start">
              <div className="flex w-full h-11 flex-col justify-center text-black font-luckiest-guy text-2xl font-normal leading-8 tracking-[0.6px] relative">
                <span>KITTY</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-start gap-8">
            {navigationItems.map((item) => (
              <div
                key={item.name}
                className="flex flex-col items-start self-stretch relative"
              >
                <a
                  href={item.href}
                  className="text-black font-inter text-sm font-semibold leading-5 relative hover:text-gray-600 transition-colors"
                >
                  <span>{item.name}</span>
                </a>
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <span
              className={`block w-6 h-0.5 bg-black transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-black transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-black transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            ></span>
          </button>

          {/* Social Icons - Hidden on mobile when menu is open */}
          <div
            className={`h-10 items-start gap-4 md:gap-8 ${mobileMenuOpen ? "hidden md:flex" : "hidden md:flex"}`}
          ></div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Menu panel */}
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm">
            <div className="rounded-2xl border-2 border-black bg-duis shadow-[6px_6px_0_0_#000] backdrop-blur-md p-6">
              <nav className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className="text-left text-black font-inter text-lg font-semibold leading-6 py-3 px-4 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FigmaHeader;
