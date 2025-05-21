"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ArrowRight,
  Atom,
  AudioLines,
  Cpu,
  Globe,
  Mic,
  Paperclip,
  SearchCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AIModelsOption } from "../services/Shared";
import supabase from "../services/supabase";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

const ChatBox = () => {
  const router = useRouter();
  const [userSearchInput, setUserSearchInput] = useState("");
  const [searchType, setSearchType] = useState("search");
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const libId = uuidv4();

  const onSearchQuery = async () => {
    const result = await supabase
      .from("Library")
      .insert([
        {
          searchinput: userSearchInput,
          userEmail: user.primaryEmailAddress?.emailAddress,
          type: searchType,
          libid: libId,
        },
      ])
      .select();
    router.push("/search/" + libId);
  };
  return (
    <div className="flex flex-col h-screen items-center justify-center w-full">
      <Image src={"/logo.png"} alt="Logo" width={260} height={250} />
      <div className="p-2 w-full max-w-2xl border rounded-2xl mt-10">
        <div className="flex justify-between items-end">
          <Tabs defaultValue="Search" className="w-full">
            <TabsContent value="Search">
              <input
                type="text"
                className="outline-none w-full p-4"
                onChange={(e) => setUserSearchInput(e.target.value)}
                placeholder="Ask Anything"
              />
            </TabsContent>
            <TabsContent value="Research">
              <input
                type="text"
                className="outline-none w-full p-4"
                onChange={(e) => setUserSearchInput(e.target.value)}
                placeholder="Research Anything"
              />
            </TabsContent>
            <TabsList>
              <TabsTrigger
                value="Search"
                className={"text-primary"}
                onClick={() => setSearchType("search")}
              >
                <SearchCheck />
                Search
              </TabsTrigger>
              <TabsTrigger
                value="Research"
                className={"text-primary"}
                onClick={() => setSearchType("research")}
              >
                <Atom />
                Research
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-4 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="accent text-white">
                  <Cpu className="text-white h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {AIModelsOption.map((model, index) => (
                  <DropdownMenuItem key={index}>
                    <div className="mb-1">
                      <h2 className="text-sm">{model.name}</h2>
                      <p className="text-xs">{model.desc}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button className="ghost">
              <Globe className="text-white h-5 w-5" />
            </Button>
            <Button className="ghost">
              <Paperclip className="text-white h-5 w-5" />
            </Button>
            <Button className="ghost">
              <Mic className="text-white h-5 w-5" />
            </Button>
            <Button
              onClick={() => {
                userSearchInput ? onSearchQuery() : null;
              }}
              className="ghost"
            >
              {!userSearchInput ? (
                <AudioLines className="text-white h-5 w-5" />
              ) : (
                <ArrowRight className="text-white h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
