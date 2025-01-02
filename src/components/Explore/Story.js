"use client";
import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function Story() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [claps, setClaps] = useState(0);
  const [comments, setComments] = useState([]);

  let post = {
    id: 1,
    title: "Aati Ho To Baarish Lete Aana",
    content: `
Aati Ho To Baarish Lete Aana
Jee Bhar Ke Rone Ka Dil Karta Hai
Rehti Hai Ye Khwahis Hothon Par Hi
Jab Bhi Ye Dil Mera Jo Bharta Hai…


Kuch Khwab Hai Likhe Khaton Mein
Tumko Shaup Doon
Iss Dard Ki Zamin Pe Main
Khud Ko Rop Doon…

Hmm… Hmmm… Hmm…
Hmm… Mmm… Mmmm…
........
Waqt Ki Thi Humse Kuch Narazgi
Keh Na Sake Hum Wo Batein Aaj Bhi
Jinko Liye Hum Tum Ho Gaye Juda…

Phir Bhi Wo Lamhe Tu Lete Aanaa
Aadhe Adhure Se Jo Chhute Thhe
Taare Bhi Wo Saare Lete Aana
Jo Humne Dekha Tha Ki Toote The…

Kuch Chal Raha Hai Saath Saath
Aur Hai Kuch Thama
Gum Beh Raha Hai Aas Paas
Aur Hai Kuch Zamaa…
....


Aati Ho To Baarish Lete Aana
Jee Bhar Ke Rone Ka Dil Karta Hai
Rehti Hai Ye Khwahis Hothon Par Hi
Jab Bhi Ye Dil Mera Jo Bharta Hai…

        `,
    author: "John Doe",
    date: "2021-01-01",
  };

  const truncatedContent = post.content.split("\n").slice(0, 8).join("\n");

  const handleClap = () => {
    setClaps(claps + 1);
  };

  const handleCommentIconClick = () => {
    // Logic to show the comment popup will be added here
    console.log("Comment icon clicked");
  };

  return (
    <div className="flex flex-col gap-4 my-4">
      <div className="title">
        <Link href={`/story/${post.id}`}><h1 className="text-4xl font-bold">{post.title}</h1></Link>
      </div>
      <div className="content leading-relaxed text-gray-500 text-lg">
        <pre>
          {isExpanded ? post.content : truncatedContent}
        </pre>
        {!isExpanded && (
          <div
            className="relative cursor-pointer text-blue-500"
            onClick={() => setIsExpanded(true)}
          >
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent"></div>
            <span className="absolute bottom-0 left-0 w-full text-center text-sm">Read more ↓</span>
          </div>
        )}
        <p className="text-gray-500 text-sm">
          {post.author} - {post.date} 
        </p>
      </div>
      <div className="actions flex gap-4">
        <button onClick={handleClap} className="clap-button text-gray-500 hover:text-gray-700 transition-colors duration-300 text-lg">
          👏 {claps}
        </button>
        <MessageCircleIcon onClick={handleCommentIconClick} className="cursor-pointer text-gray-500  h-6 w-6" />
      </div>
      <div className="comments">
        {comments.map((comment, index) => (
          <p key={index} className="comment text-gray-500 text-sm">{comment}</p>
        ))}
      </div>
    </div>
  );
}

