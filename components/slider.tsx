"use client";

import { useState } from "react";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

import Image from "next/image";
import { toBase64, shimmer } from "@/lib/image";
import Image1 from "../assets/bookstore-01.jpeg";
import Image2 from "../assets/bookstore-02.jpeg";
import Image3 from "../assets/bookstore-03.jpeg";

const SLIDE_DESCRIPTIONS = [
  "Cozy bookstore interior with warm lighting",
  "Organized bookshelf display",
  "Modern reading nook",
];

export default function Slider() {
  const slides = [Image1, Image2, Image3];

  const [current, setCurrent] = useState(0);

  let previousSlide = () => {
    if (current === 0) setCurrent(slides.length - 1);
    else setCurrent(current - 1);
  };

  let nextSlide = () => {
    if (current === slides.length - 1) setCurrent(0);
    else setCurrent(current + 1);
  };

  return (
    <div className="overflow-hidden flex justify-center items-center relative h-96 rounded-md">
      <div
        className={`flex transition ease-in-out duration-300`}
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides?.map((image, index) => {
          return (
            <Image
              key={index}
              src={image}
              alt={SLIDE_DESCRIPTIONS[index]}
              width={1200}
              height={384}
              className="object-cover object-center h-full w-full"
              placeholder="blur"
              blurDataURL={`data:image/webp;base64,${toBase64(
                shimmer(1200, 384)
              )}`}
              priority={index === 0}
              sizes="100vw"
            />
          );
        })}
      </div>
      <div className="absolute top-0 h-full w-full justify-between items-center flex text-white px-10 text-3xl">
        <button onClick={previousSlide}>
          <ArrowLeftCircle />
        </button>
        <button onClick={nextSlide}>
          <ArrowRightCircle />
        </button>
      </div>
      <div className="absolute bottom-0 py-4 flex justify-center gap-3 w-full"></div>
    </div>
  );
}
