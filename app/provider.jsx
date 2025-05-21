"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import supabase from "../services/supabase";
import { UserDetailContext } from "../context/UserDetailContext";

const Provider = ({ children }) => {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState(null); // ✅ Correct useState

  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
  }, [user]);

  const CreateNewUser = async () => {
    const { data: Users, error } = await supabase
      .from("Users")
      .select("*")
      .eq("email", user?.primaryEmailAddress?.emailAddress);

    if (error) {
      console.error("Supabase fetch error:", error);
      return;
    }

    if (!Users || Users.length === 0) {
      const { data, error } = await supabase
        .from("Users")
        .insert([
          {
            email: user?.primaryEmailAddress?.emailAddress,
            name: user?.fullName,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        return;
      }

      setUserDetail(data[0]);
      console.log("User Created", data);
    } else {
      setUserDetail(Users[0]);
      console.log("User Found", Users[0]);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div className="flex flex-col h-screen items-center justify-center">
        {children}
      </div>
    </UserDetailContext.Provider>
  );
};

export default Provider;
