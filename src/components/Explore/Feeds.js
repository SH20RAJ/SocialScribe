import React from 'react';
import PostCard from './PoemCard';

const ExplorePage = () => {
  const posts = [
    {
      id: 1,
      title: 'Journey to the Mountains',
      content: 'The mountains stood tall, casting shadows across the valley as the sun slowly dipped below the horizon. Every step I took echoed in the silence, a reminder of the solitude that enveloped me. With each breath, the crisp air filled my lungs, refreshing my spirit. The journey was arduous, but the view from the peak made every challenge worth it...',
    },
    {
      id: 2,
      title: 'Ocean’s Whisper',
      content: 'The waves gently lapped at the shore, each one carrying with it the secrets of the ocean. The sun danced on the water’s surface, creating a shimmering path that seemed to lead to another world. I could hear the whispers of the wind, mingling with the sound of the waves, telling tales of adventures long forgotten...',
    },
    // Add more posts as needed
  ];

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Explore Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default ExplorePage;
