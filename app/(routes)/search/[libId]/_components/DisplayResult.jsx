import React, { useEffect, useState } from "react";
import {
  ArrowUp,
  LucideImage,
  LucideList,
  LucideSparkles,
  LucideVideo,
  Send,
} from "lucide-react";
import axios from "axios";
import { SEARCH_RESULT } from "../../../../../services/Shared";
import AnswerDisplay from "./AnswerDisplay";
import ImageList from "./ImageList";
import SourceListTab from "./SourceListTab";
import { useParams } from "next/navigation";
import supabase from "../../../../../services/supabase";
import { Button } from "../../../../../components/ui/button";

const tabs = [
  {
    label: "Answer",
    icon: LucideSparkles,
  },
  {
    label: "Images",
    icon: LucideImage,
  },
  {
    label: "Videos",
    icon: LucideVideo,
  },
  {
    label: "Sources",
    icon: LucideList,
    badge: 10,
  },
];

const DisplayResult = ({ searchInputRecord }) => {
  const [activeTab, setActiveTab] = useState("Answer");
  const [searchResult, setSearchResult] = useState(SEARCH_RESULT);
  const { libId } = useParams();
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    if (searchInputRecord?.Chats?.length === 0) {
      GetSearchApiResult();
    } else {
      GetSearchRecords();
    }
    setSearchResult(searchInputRecord);
    console.log("searchInputRecord", searchInputRecord);
  }, [searchInputRecord]);

  const GetSearchApiResult = async () => {
    // const searchResp = SEARCH_RESULT;

    const result = await axios.post("/api/brave-search-api", {
      searchInput: searchInputRecord?.searchinput,
      searchType: searchInputRecord?.searchType ?? "Search",
    });

    const searchResp = result.data;

    const formattedResult = searchResp?.web?.results?.map((item) => ({
      title: item.title,
      description: item.description,
      long_name: item.profile?.long_name,
      img: item.profile?.img,
      url: item.url,
      thumbnail: item.thumbnail,
    }));

    const { data, error } = await supabase
      .from("Chats")
      .insert([
        {
          libId: libId,
          searchResult: formattedResult,
          searchInput: searchInputRecord?.searchinput,
        },
      ])
      .select();
    await GetSearchRecords();

    if (error) {
      console.error("Supabase insert error:", error);
      return;
    }

    if (data && data.length > 0) {
      await GenerateAiResponse(formattedResult, data[0].id);
    }
  };

  const GenerateAiResponse = async (formattedResult, recordId) => {
    const res = await axios.post("/api/llm-model", {
      searchInput: searchInputRecord?.searchinput,
      searchResult: formattedResult,
      recordId: recordId,
    });

    const runId = res.data;

    const interval = setInterval(async () => {
      const runResp = await axios.post("/api/get-inngest", {
        runId: runId,
      });

      console.log("Run Response", runResp.data);
      if (runResp?.data?.data?.[0]?.status === "Completed") {
        console.log("AI task completed");
        await GetSearchRecords();
        clearInterval(interval);
      }
    }, 1000);
  };

  const GetSearchRecords = async () => {
    let { data, error } = await supabase
      .from("Library")
      .select("*,Chats(*)")
      .eq("libid", libId)
      .order('id',{foreignTable :'Chats', ascending:true})

    setSearchResult(data[0]);
  };

  return (
    <div className="mt-7">
      {/* <h2 className="font-medium text-3xl line-clamp-2">
        {searchInputRecord?.searchinput}
      </h2> */}

      {searchResult?.Chats?.map((chat, index) => (
        <div key={index}>
          <h2 className="font-medium text-3xl line-clamp-2">
            {chat?.searchInput}
          </h2>
          <div className="flex gap-4 mt-4">
            {tabs.map(({ label, icon: Icon, badge }) => (
              <button
                key={label}
                className={`flex items-center gap-2 px-3 py-1 rounded-md ${
                  activeTab === label
                    ? "bg-gray-200 text-black"
                    : "text-gray-500 hover:text-black"
                }`}
                onClick={() => setActiveTab(label)}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
                {badge && (
                  <span className="bg-gray-300 text-gray-800 rounded-full px-2 text-xs font-medium">
                    {badge}
                  </span>
                )}
              </button>
            ))}
            <div className="ml-auto text-sm text-gray-500 flex items-center">
              1 Task{" "}
              <span className="ml-1">
                <ArrowUp />
              </span>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "Answer" ? (
              <AnswerDisplay chat={chat} />
            ) : activeTab === "Images" ? (
              <ImageList chat={chat} />
            ) : activeTab === "Sources" ? (
              <SourceListTab chat={chat} />
            ) : null}
            {/* Add more tab content as needed */}
          </div>
          <hr className="my-5" />
        </div>
      ))}
      <div className="bg-white w-full border rounded-lg shadown-md p-3 px-5 mb-10 flex justify-between fixed bottom-6 xl:max-w-3xl">
        <input
          type="text"
          placeholder="Type anything..."
          className="outline-none"
          onChange={(e) => setUserInput(e.target.value)}
        />
        {userInput.length && (
          <Button onClick={GetSearchApiResult}>
            <Send />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DisplayResult;
