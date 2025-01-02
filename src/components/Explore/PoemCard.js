'use client';

import React, { useState } from 'react';

const PoemCard = ({ poem }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [claps, setClaps] = useState(0);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClap = () => {
    setClaps(claps + 1);
  };

  return (
    <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-black mb-2">{poem.title}</h2>
      <p className="text-gray-600 mb-4">
        {isExpanded ? poem.fullText : poem.sampleText}
      </p>
      <button
        onClick={toggleExpand}
        className="text-indigo-600 hover:underline focus:outline-none mb-4 block"
      >
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
      <div className="flex items-center mb-4">
        <button
          onClick={handleClap}
          className="flex items-center text-indigo-600 focus:outline-none"
        >
          <span className="material-icons mr-2">clap</span>
          {claps} Clap{claps !== 1 ? 's' : ''}
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-indigo-600 focus:outline-none">
          <span className="material-icons">share</span> Share
        </button>
        <button className="text-indigo-600 focus:outline-none">
          <span className="material-icons">comment</span> Comment
        </button>
        <button className="text-indigo-600 focus:outline-none relative">
          <span className="material-icons">more_horiz</span>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block">
            <ul className="list-none p-2">
              <li className="p-2 hover:bg-gray-100 cursor-pointer">Share</li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">Comment</li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">Save</li>
            </ul>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PoemCard;
