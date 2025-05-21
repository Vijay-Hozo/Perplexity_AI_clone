import Image from "next/image";
import React from "react";

const ImageList = ({ chat }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4" >
      {chat.searchResult.map((item, index) => {
        const imageUrl =
          item?.thumbnail?.src || item?.thumbnail?.original || "/fallback.jpg";

        return (
          <Image
            key={index}
            src={imageUrl}
            alt={item?.title || "Result thumbnail"}
            width={200}
            height={200}
            className="bg-accent rounded-xl "
          />
        );
      })}
    </div>
  );
};

export default ImageList;
