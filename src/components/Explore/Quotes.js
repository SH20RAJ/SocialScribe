import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CarouselSpacing() {


    let quotes = [
        {
            id: 1,
            quote: 'The best way to predict the future is to create it.',
            author : "Abraham Lincoln",
            postedOn : "2021-10-01",
            claps : 10

        },
        {
            id: 2,
            quote: 'People are just as happy as they make up their minds to be.',
            author : "Abraham Lincoln",
            postedOn : "2021-10-01",
            claps : 10

        },
        {
            id: 3,
            quote: 'The best way to predict the future is to create it.',
            author : "Abraham Lincoln",
            postedOn : "2021-10-01",
            claps : 10

        },
        {
            id: 4,
            quote: 'The best way to predict the future is to create it.',
            author : "Abraham Lincoln",
            postedOn : "2021-10-01",
            claps : 10

        },
        {
            id: 5,
            quote: 'The best way to predict the future is to create it.',
            author : "Abraham Lincoln",
            postedOn : "2021-10-01",
            claps : 10

        },
        {
            id: 6,
            quote: 'The best way to predict the future is to create it.',
            author : "Abraham Lincoln",
            postedOn : "2021-10-01",
            claps : 10

        },
        {
            id: 7,
            quote: 'The best way to predict the future is to create it.',
            author : "Abraham Lincoln",
            postedOn : "2021-10-01",
            claps : 10

        },
        {
            id: 8,
            quote: 'The best way to predict the future is to create it.',
            author : "Abraham Lincoln",
            postedOn : "2021-10-01",
            claps : 10

        },
        {
            id: 9,
            quote: 'The best way to predict the future is to create it.',
            author : "Abraham Lincoln",
            postedOn : "2021-10-01",
            claps : 10

        },
        {
            id: 10,
            quote: 'The best way to predict the future is to create it.',
            author : "Abraham Lincoln",
            postedOn : "2021-10-01",
            claps : 10

        }
    ];


  return (
    <>
      <div className=" my-8">
        <h1 className="text-2xl font-semibold">Quotes of the day</h1>
        <p className="text-sm text-gray-600">
            A collection of inspiring quotes to brighten your day.
        </p>
        <Carousel className="w-full max-w-[90%]">
          <CarouselContent className="-ml-1">
            {quotes.map((quote, index) => (
              <CarouselItem
                key={index}
                className="pl-1 md:basis-1/2 lg:basis-1/4 h-"
              >
                <div className="p-1 cursor-pointer">
                  <Card>
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                      <span className="text-xl font-semibold truncate-it-to-word-limit">
                        {quote.quote}
                      </span>
                      <span className=" mt-2">
                        <p className="text-sm text-gray-600">
                           -  {quote.author}
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
