import React from "react";
import FlipCard from "./FlipCard";

const cardData = [
  {
    title: "Tech Innovations",
    description: "Explore the latest in technology.",
    image: "https://source.unsplash.com/300x200/?technology",
  },
  {
    title: "Nature Beauty",
    description: "Discover the wonders of nature.",
    image: "https://source.unsplash.com/300x200/?nature",
  },
  {
    title: "Space Exploration",
    description: "Dive into the cosmos and beyond.",
    image: "https://source.unsplash.com/300x200/?space",
  },
];

const Card = () => {
  return (
    <div className="flex flex-wrap justify-center gap-8 py-10 animate-fadeIn">
      {cardData.map((card, index) => (
        <FlipCard key={index} {...card} />
      ))}
    </div>
  );
};

export default Card;
