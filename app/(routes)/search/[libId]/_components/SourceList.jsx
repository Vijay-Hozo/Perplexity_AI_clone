import React from "react";

const stripTags = (str) => str?.replace(/<strong>|<\/strong>/g, "") || "";

const SourceList = ({ webResult }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {webResult?.map((result, index) => (
        <div
          key={index}
          className="bg-accent rounded-lg p-3 w-[200px] cursor-pointer hover:bg-[#e1e3da] transition"
          onClick={() => window.open(result?.url, "_blank")}
        >
          <div className="flex flex-col gap-2">
            {result?.img && (
              <img
                src={result.img}
                alt={stripTags(result?.long_name) || "Source"}
                className="w-full h-24 object-cover rounded-md"
              />
            )}
            <h2 className="text-xs text-gray-700 font-medium line-clamp-2">
              {stripTags(result?.long_name)}
            </h2>
            <p className="text-xs text-black line-clamp-3">
              {stripTags(result?.description)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SourceList;
