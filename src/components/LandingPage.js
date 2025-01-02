'use client';

import React from 'react';
import Link from 'next/link';

const LandingPage = () => {
  const categories = [
    { title: "Poems", description: "Express your feelings through words." },
    { title: "Shayari", description: "Beautifully crafted short poems." },
    { title: "Jokes", description: "Spread laughter with your humor." },
    { title: "Songs", description: "Share your lyrics and melodies." },
    { title: "Music", description: "Create and share your musical compositions." },
    { title: "Stories", description: "Tell captivating tales." },
    { title: "Movie Scripts", description: "Write scripts for the big screen." }
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      {/* Welcome Section */}
      <h1 className="text-4xl font-bold text-black mb-6 animate-fadeIn">
        Welcome to Multiversal Writer
      </h1>
      <p className="text-lg text-gray-700 mb-10 text-center max-w-xl">
        Your space to share poems, shayari, jokes, songs, music, stories, and movie scripts with the world. Let your creativity shine!
      </p>

      {/* Call to Action Buttons */}
      <div className="flex space-x-4 mb-12">
        <Link href="/signup" className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition duration-200">
          Get Started
        </Link>
        <Link href="/explore" className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md shadow-md hover:bg-indigo-100 transition duration-200">
          Explore
        </Link>
      </div>

      {/* Content Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl placece">
        {categories.map((category, index) => (
          <div
            key={index}
            className="p-6 cursor-pointer border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-indigo-600 transition duration-300 transform hover:scale-105"
          >
            <h2 className="text-xl font-semibold text-black mb-2">
              {category.title}
            </h2>
            <p className="text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>

      {/* Subtle Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 2s ease-in-out;
        }
      `}</style>
    </main>
  );
};

export default LandingPage;
