import React from "react";

const FlipCard = ({ title, description, image }) => {
  return (
    <div className="group [perspective:1000px] w-72 h-96">
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        
        {/* Front Side */}
        <div className="absolute inset-0 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center text-center p-4 [backface-visibility:hidden]">
          <img
            src={image}
            alt={title}
            className="w-full h-40 object-cover rounded-t-lg"
          />
          <h2 className="text-xl font-bold mt-4">{title}</h2>
          <p className="text-gray-500 mt-2">{description}</p>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg rounded-lg flex flex-col items-center justify-center text-center p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="mt-2">More exciting details here!</p>
          <button className="mt-4 px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-all">
            Learn More
          </button>
        </div>

      </div>
    </div>
  );
};

export default FlipCard;
