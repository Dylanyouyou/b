import Image from "next/image";

import Header from "./_components/Header";
import Nav from "./_components/Nav";
import Hero from "./_components/Hero";
import FigmaHeader from "./_components/FigmaHeader";
import Contract from "./_components/Contract";

import About from "./_components/About";
import AboutMomo from "./_components/AboutMomo";
import ContractSection from "./_components/ContractSection";
import Tokenomics from "./_components/Tokenomics";
import Exchanges from "./_components/Exchanges";
import HowToBuy from "./_components/HowToBuy";
import WallOfLove from "./_components/WallOfLove";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <>
      {/* New Figma Header */}
      <FigmaHeader />

      {/* New Figma Hero Section */}
      <Hero />

      <span className="block bg-duis border-red-900 border-[9.6px] h-[3px]"></span>

      {/* About MOMO Section */}
      <AboutMomo />

      {/* Red Divider */}
      <span className="block bg-duis h-[3px] border-[9.6px] border-red-900"></span>

      {/* Contract Section */}
      <ContractSection />

      {/* Original sections restored */}
      <div className="bg-[#e4e0e1] -mt-1">
        <div className="relative">
          <span className="block bg-duis flex-1 h-[3px] border-[10px] border-solid border-red-900"></span>
        </div>

        <div className="max-w-[85rem] mx-auto py-12 text-gray-200 bg-white bg-opacity-5">
          <div
            className="my-16 text-center text-6xl font-luckiest-guy"
            style={{
              color: "#C42B10",
              textShadow:
                "4px 4px 0 #000, 6px 6px 0 #000, 0 4px 0 #000, -2px -2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, 2px 2px 0 #000",
            }}
          >
            <p>TOKENOMICS</p>
          </div>
          <Tokenomics />
        </div>

        <div className="max-w-[85rem] mx-auto mt-24">
          <span className="flex items-center">
            <div></div>
          </span>
        </div>
        <span className="block bg-duis flex-1 h-[3px] border-[10px] border-solid border-red-900"></span>

        <div className="max-w-[85rem] mx-auto py-12 text-gray-200">
          <HowToBuy />
        </div>
        <div className="text-center">
          <div className="flex justify-center"></div>
          <div className="mt-5">
            <p className="font-stopbuck text-2xl text-black">Meow! Meow!</p>
          </div>
        </div>
        {/* <WallOfLove /> */}
        <div className="flex justify-start pl-4"></div>
        <Footer />
      </div>
    </>
  );
}
