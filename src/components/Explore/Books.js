import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Books() {


    let books = [
        /* diff books with id: 1,
            title: 'The Alchemist',
            author : "Paulo Coelho",
            genre : "Adventure",
            publishedOn : "2021-10-01",
            rating : 4.5 and poster */
        {
            id: 1,
            title: 'The Alchemist',
            author : "Paulo Coelho",
            genre : "Adventure",
            publishedOn : "2021-10-01",
            rating : 4.5,
            poster : "https://miro.medium.com/v2/resize:fit:1400/0*kMU2EapHzpvWIKX8.jpg"
        },
        {
            id: 2,
            title: 'The Alchemist',
            author : "Paulo Coelho",
            genre : "Adventure",
            publishedOn : "2021-10-01",
            rating : 4.5,
            poster : "https://miro.medium.com/v2/resize:fit:1400/0*kMU2EapHzpvWIKX8.jpg"
        },
        {
            id: 3,
            title: 'The Alchemist',
            author : "Paulo Coelho",
            genre : "Adventure",
            publishedOn : "2021-10-01",
            rating : 4.5,
            poster : "https://miro.medium.com/v2/resize:fit:1400/0*kMU2EapHzpvWIKX8.jpg"
        },
        {
            id: 4,
            title: 'The Alchemist',
            author : "Paulo Coelho",
            genre : "Adventure",
            publishedOn : "2021-10-01",
            rating : 4.5,
            poster : "https://miro.medium.com/v2/resize:fit:1400/0*kMU2EapHzpvWIKX8.jpg"
        },
        {
            id: 5,
            title: 'The Alchemist',
            author : "Paulo Coelho",
            genre : "Adventure",
            publishedOn : "2021-10-01",
            rating : 4.5,
            poster : "https://miro.medium.com/v2/resize:fit:1400/0*kMU2EapHzpvWIKX8.jpg"
        },

    ]


  return (
    <>
      <div className=" my-8">
        <h1 className="text-2xl font-semibold">Trending Books Today</h1>
        <p className="text-sm text-gray-600">
          Explore the latest books that everyone is talking about.
        </p>
        <Carousel className="w-full max-w-[90%]">
          <CarouselContent className="-ml-1">
            {books.map((book, index) => (
              <CarouselItem
                key={index}
                className="pl-1 md:basis-1/2 lg:basis-1/4 h-"
              >
                <div className="p-1 cursor-pointer">
                  <Card>
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                      <img
                        src={book.poster}
                        alt={book.title}
                        className="w-24 h-24 object-cover rounded-full"
                      />
                      <span className="text-xl font-semibold truncate-it-to-word-limit">
                        {book.title} 
                        <p>
                          <span className="text-sm text-gray-600">
                             ⭐️ {book.rating}
                          </span>
                        </p>
                      </span>
                      <span className=" mt-2">
                        <p className="text-sm text-gray-600">
                           -  {book.author}
                        </p>

                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
}
