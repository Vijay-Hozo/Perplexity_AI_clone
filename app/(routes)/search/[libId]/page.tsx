"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import supabase from "../../../../services/supabase";
import Header from "../[libId]/_components/Header";
import DisplayResult from "./_components/DisplayResult";

function SearchQueryResult() {
  const { libId } = useParams();
  const [searchInputRecord, setSearchInputRecord] = useState(null);

  useEffect(() => {
    getSearchQueryResult();
  }, []);

  const getSearchQueryResult = async () => {
    const { data: Library, error } = await supabase
      .from("Library")
      .select("*,Chats(*)")
      .eq("libid", libId)

    console.log("library", Library[0]);
    setSearchInputRecord(Library[0]);
  };

  return (
    <div className="w-full">
      {searchInputRecord && <Header searchInputRecord={searchInputRecord} />}
      <div className="px-10 md:px-20 lg:px-36 xl:px-56 mt-20">
        {searchInputRecord && (
          <DisplayResult searchInputRecord={searchInputRecord} />
        )}
      </div>
    </div>
  );
}

export default SearchQueryResult;
