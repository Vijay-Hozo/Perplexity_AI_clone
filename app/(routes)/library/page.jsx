"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import supabase from "../../../services/supabase";
import moment from "moment";
import { SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

function Library() {
  const { user } = useUser();
  const [libraryHistory, setLibraryHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      GetLibraryHistory();
    }
  }, [user]);

  const GetLibraryHistory = async () => {
    const { data: Library, error } = await supabase
      .from("Library")
      .select("*")
      .eq("userEmail", user?.primaryEmailAddress?.emailAddress)
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching library history:", error);
    } else {
      setLibraryHistory(Library || []);
      console.log("Library history:", Library);
    }
  };

  return (
    <div className="px-10 md:px-20 lg:px-36 xl:px-56 mt-20 w-full">
      <h2 className="font-bold text-2xl">Library</h2>
      <div className="mt-6 space-y-2">
        {libraryHistory.length === 0 ? (
          <p className="text-gray-500">No search history found.</p>
        ) : (
          libraryHistory.map((item, index) => (
            <div key={index} onClick={() => router.push('/search/' + item.libid)} className="cursor-pointer">
               <div className="flex items-center justify-between">
                <h2 key={index} className="text-lg text-gray-800 font-bold">
                  {item.searchinput}
                </h2>
                <p className="text-xs text-gray-500">
                  {moment(item.created_at).fromNow()}
                </p>
              </div>
              <SquareArrowOutUpRight className="h-4 w-4" />
                <hr className="my-4" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Library;
