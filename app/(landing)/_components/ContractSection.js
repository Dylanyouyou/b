"use client";

import React, { useState, useRef } from "react";

const ContractSection = () => {
  const [copied, setCopied] = useState(false);
  const textRef = useRef(null);

  const handleCopy = async () => {
    try {
      // Get the actual text content from the displayed element
      const textToCopy = textRef.current
        ? textRef.current.innerText || textRef.current.textContent
        : "CA:";

      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand("copy");
          if (successful) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }
        } catch (err) {
          console.error("Fallback copy failed: ", err);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error("Copy failed: ", err);
      // Still show success message for user feedback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="contract"
      className="flex w-full justify-center items-center"
      style={{
        backgroundColor: "rgba(228, 224, 225, 1)",
        padding: "58px 128px 108px",
      }}
    >
      <div className="w-full max-w-6xl flex flex-col items-center">
        {/* CONTRACT Heading */}
        <div className="flex flex-col items-center">
          <div
            className="my-16 text-center text-6xl font-luckiest-guy"
            style={{
              color: "rgba(196, 43, 16, 1)",
              textShadow:
                "4px 4px 0 #000, 6px 6px 0 #000, 0 4px 0 #000, -2px -2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, 2px 2px 0 #000",
            }}
          >
            CONTRACT
          </div>
        </div>

        {/* Contract Address Container */}
        <div className="w-full max-w-2xl">
          <div className="relative flex justify-center items-center">
            <div
              className="flex w-full max-w-xl h-16 px-4 py-2 justify-center items-center rounded-full border-4 border-black bg-white bg-opacity-90 shadow-[6px_6px_0_0_#000] backdrop-blur-sm cursor-pointer hover:bg-opacity-100 hover:shadow-[8px_8px_0_0_#000] hover:scale-105 transition-all duration-200 active:scale-95"
              onClick={handleCopy}
              title="Click to copy contract address"
            >
              <div className="flex w-full justify-center items-center">
                <span
                  ref={textRef}
                  className="text-gray-800 font-inter text-sm md:text-base font-normal leading-6 text-center truncate px-4"
                >
                  {copied ? (
                    <p className="text-green-600 font-semibold">Text Copied!</p>
                  ) : (
                    <p>
                      CA<span style={{ fontSize: "18px" }}>: SOON</span>
                    </p>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContractSection;
