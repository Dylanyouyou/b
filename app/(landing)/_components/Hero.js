"use client";

import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const Hero = () => {
  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            "linear-gradient(180deg, #F95959 0%, #CC7575 26.92%, rgba(210, 137, 137, 0.89) 46.15%, #EBD4D4 100%)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-8 lg:px-12 mx-auto">
        <div className="flex flex-col items-start gap-7 lg:gap-8">
          {/* Main Heading */}
          <div
            className="flex flex-col items-start w-full"
            style={{ marginTop: "-2px" }}
          >
            <h1
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-normal leading-tight"
              style={{
                fontFamily:
                  'var(--font-luckiest-guy), "Luckiest Guy", -apple-system, Roboto, Helvetica, sans-serif',
                color: "#C42B10",
                textShadow: `
                  4px 4px 0 #000, 
                  6px 6px 0 #000, 
                  0 4px 0 #000, 
                  -2px -2px 0 #000, 
                  -2px 2px 0 #000, 
                  2px -2px 0 #000, 
                  2px 2px 0 #000
                `,
                WebkitTextStroke: "2px #000",
                lineHeight: "1",
              }}
            >
              <span style={{ color: "rgba(255,255,255,1)" }}>
                <br />
                KITTY
              </span>
              <br />
              <span style={{ color: "rgba(196,43,16,1)" }}>THE MECHANIC</span>
            </h1>
          </div>

          {/* Description Text */}
          <div className="max-w-lg lg:max-w-xl">
            <p
              className={`${inter.className} text-sm sm:text-base lg:text-lg font-bold leading-relaxed`}
              style={{
                color: "rgba(255,255,255,0.9)",
                fontWeight: 700,
              }}
            >
              YOUR FAVOURITE INTERNET CAT !
            </p>
          </div>

          {/* Buttons Container */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 w-full sm:w-auto">
            {/* Buy Kitty Button */}
            <div
              className={`${inter.className} flex items-center justify-center px-8 py-4 sm:px-9 sm:py-5 text-sm sm:text-base font-bold leading-6 transition-all duration-200 hover:transform hover:translate-y-1 hover:shadow-md cursor-pointer`}
              style={{
                borderRadius: "19.2px",
                border: "3px solid #000",
                background: "#FFF",
                boxShadow: "6px 6px 0 0 #000",
                color: "#C42B10",
              }}
            >
              BUY KITTY
            </div>

            {/* Community Button */}
            <div
              onClick={() =>
                window.open(
                  "https://x.com/i/communities/1950692617940783237",
                  "_blank",
                )
              }
              className={`${inter.className} flex items-center justify-center px-8 py-4 sm:px-9 sm:py-5 text-sm sm:text-base font-bold leading-6 transition-all duration-200 hover:transform hover:translate-y-1 hover:shadow-md cursor-pointer`}
              style={{
                borderRadius: "19.2px",
                border: "3px solid #000",
                background: "#000",
                boxShadow: "6px 6px 0 0 #000",
                color: "#FFF",
              }}
            >
              <p>COMMUNITY</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
