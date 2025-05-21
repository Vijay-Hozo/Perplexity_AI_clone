"use client";
import axios from "axios";
import {
  Cpu,
  DollarSign,
  Globe,
  Palette,
  Star,
  Volleyball,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import NewsCard from "../../../app/(routes)/search/[libId]/_components/NewsCard";

const options = [
  { title: "Top", icon: Star },
  { title: "Tech & Science", icon: Cpu },
  { title: "Finance", icon: DollarSign },
  { title: "Art & Culture", icon: Palette },
  { title: "Sports", icon: Volleyball },
];

function Discover() {
  const [selectedOption, setSelectedOption] = useState("Top");
  const [latestNews, setLatestNews] = useState()

  useEffect(() => {
    if (selectedOption) {
      GetSearchResult();
    }
  }, [selectedOption]);

  const GetSearchResult = async () => {
    try {
      const result = await axios.post("/api/brave-search-api", {
        searchInput: selectedOption + " Latest News & Updates",
        searchType: "Search",
      });

      const webSearchResults = result?.data?.web?.results;
      setLatestNews(webSearchResults);

      console.log("result.data", result.data);

      // Make sure to extract correct array based on Brave API response structure
      const items = result.data.results || result.data.web?.results || [];
      setLatestNews(items);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setLatestNews([]);
    }
  };

  return (
    <div className="px-10 md:px-20 lg:px-36 xl:px-56 mt-20 w-full">
      <h2 className="font-bold text-3xl flex gap-2 items-center">
        <Globe />
        <span>Discover</span>
      </h2>

      <div className="flex mt-5 gap-4 flex-wrap">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => setSelectedOption(option.title)}
            className={`flex items-center gap-2 p-3 rounded-md hover:text-primary cursor-pointer ${
              selectedOption === option.title
                ? "bg-accent text-primary rounded-full"
                : ""
            }`}
          >
            <option.icon className="h-5 w-5 text-gray-500" />
            <span className="text-gray-800">{option.title}</span>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-6">
        {Array.isArray(latestNews) && latestNews.length > 0 ? (
          latestNews.map((item, index) => (
            <NewsCard news={item} key={index} />
          ))
        ) : (
          <p className="text-muted-foreground mt-6">No news found.</p>
        )}
      </div>
      {/* <div className="grid grid-cols-2 gap-2">
        {latestNews.map((item, index) => (
          <NewsCard news= {item} key={index}  />
        ))}
      </div> */}
    </div>
  );
}

export default Discover;
