import React from 'react';

const MainSection = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      {/* Header */}
      <h1 className="text-3xl font-bold text-black mb-4">
        Welcome to Multiversal Writer
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
        Share your poems, shayari, jokes, songs, music, stories, and movie scripts with the world. Let your creativity flow and connect with a community of fellow creators.
      </p>

      {/* Content Area */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Example content items */}
        <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-black">Poems</h2>
          <p className="text-gray-600 mt-2">Explore a world of poetry from talented writers around the globe.</p>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-black">Stories</h2>
          <p className="text-gray-600 mt-2">Dive into captivating stories that will take you on an unforgettable journey.</p>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-black">Songs</h2>
          <p className="text-gray-600 mt-2">Listen to songs that touch the soul, created by artists from all walks of life.</p>
        </div>

        {/* Add more content as needed */}
      </section>
    </main>
  );
};

export default MainSection;
