"use client";

import { cn } from "@/lib/utils";
import { AlignLeftIcon, NewspaperIcon, RadarIcon, Touchpad, TrendingUpIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Sidebar() {
  let options = [
    {
      title: "All",
      description: "Explore all the posts",
      slug: "all",
      icon : <AlignLeftIcon/>
    },
    {
      title: "Trending",
      description: "Explore the trending posts",
      slug: "trending",
      icon : <TrendingUpIcon/>
    },
    {
      title: "New",
      description: "Explore the new posts",
      slug: "new",
      icon : <NewspaperIcon/>
    },
    {
      title: "Top",
      description: "Explore the top posts",
      slug: "top",
      icon : <Touchpad/>
    },
    {
      title: "Random",
      description: "Explore random posts",
      slug: "random",
      icon : <RadarIcon/>
    },
  ];
  return (
    <div className=" w-full m-2 ">
      <div className="flex flex-col w-full">
        {options.map((option) => (
          <Link href={`/explore/${option.slug}`} key={option.slug}>
            <span className={cn("flex items-center p-2 rounded-md w-full", "hover:bg-gray-100")}>
              <div className="mr-4">{option.icon}</div>
              <div className="flex flex-col">
                <div className="text-lg font-semibold">{option.title}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
