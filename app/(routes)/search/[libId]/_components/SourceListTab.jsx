import Image from "next/image";
import React from "react";

const SourceListTab = ({ chat }) => {
  return (
    <div>
      {chat?.searchResult.map((item, index) => (
        <div key={index} >
          <div className="flex gap-2 items-center mt-4">
            <h2>{index + 1}</h2>
            <Image
              src={item.img}
              alt={item.title}
              width={20}
              height={20}
              className="rounded-full w-[20px] h-[20px] border"
            />
            <div>
              <h2 className="text-xs">{item.long_name}</h2>
            </div>
          </div>
          <h2 className="mt-1 line-clamp-1 font-bold text-lg text-gray-600">
            {item.title}
          </h2>
          <h2 className="mt-1 text-xs text-gray-600">{item.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default SourceListTab;
