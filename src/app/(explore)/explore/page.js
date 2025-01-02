"use client";

import Books from "@/components/Explore/Books";
import Poems from "@/components/Explore/Poems";
import Quotes from "@/components/Explore/Quotes";
import Story from "@/components/Explore/Story";

const ExplorePage = () => {
  return (
    <main className="flex flex-col min-h-screen p-4 bg-white gap-2">
      <Quotes />

      <hr />
      <Poems />

      <hr />
      <Books />
      <hr />
      <Story />
      
    </main>
  );
};

export default ExplorePage;
