/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

// import { createRoot } from "react-dom/client";
// import Highlighter from "react-highlight-words";
// import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

interface SearchFieldProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredMessage: any[];
  currentIndex: number;
  onNavigate: (direction: "next" | "prev") => void;
}

const SearchField: React.FC<SearchFieldProps> = ({
  searchQuery,
  setSearchQuery,
  filteredMessage,
  currentIndex,
  // onNavigate,
}) => {
  return (
    <div
      id="search"
      className="relative w-full max-w-3xl mx-auto top-6 shadow-custom1 z-30"
    >
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        placeholder="Search..."
        className="w-full bg-[#19232FCC] backdrop-blur-[2px] text-white text-lg placeholder-gray-400 py-4 pl-6 pr-12 rounded-lg focus:outline-none shadow-lg"
      />

      <div className="absolute top-0 right-0 h-full flex items-center pr-6 gap-3">
        {/* Match Counter */}
        <h1 className="mr-2">
          {filteredMessage?.length ? `${currentIndex + 1}` : "0"}/
          {filteredMessage?.length || "0"}
        </h1>

        {/* Navigation Buttons */}
        {/* <button
          onClick={() => onNavigate("prev")}
          disabled={!filteredMessage?.length}
          className={`text-yellow-400 ${
            !filteredMessage?.length && "opacity-50"
          }`}
        >
          <FaChevronDown />
        </button>

        <button
          onClick={() => onNavigate("next")}
          disabled={!filteredMessage?.length}
          className={`text-yellow-400 ${
            !filteredMessage?.length && "opacity-50"
          }`}
        >
          <FaChevronUp />
        </button> */}

        {/* Search Icon */}
        <FiSearch className="text-yellow-400 w-6 h-6" />
      </div>
    </div>
  );
};

export default SearchField;
