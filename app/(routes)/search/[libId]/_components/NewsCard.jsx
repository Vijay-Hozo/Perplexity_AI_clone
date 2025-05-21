import React from "react";

const NewsCard = ({ news, index }) => {
  const cleanDescription = news?.description
    ? news.description.replace(/<\/?strong>/g, "")
    : "No description available.";

  return (
    <div className="border rounded-2xl mt-6" onClick={() => window.open(news?.url, "_blank")}>
      <img
        src={news?.thumbnail?.original}
        alt={news?.title || "News Image"}
        width={700}
        height={400}
        className=" rounded-2xl object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold">{news?.title || "No Title"}</h2>
        <p className="text-sm text-gray-500 line-clamp-2">{cleanDescription}</p>
      </div>
    </div>
  );
};

export default NewsCard;
