"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserDetailsContext } from "@/context/userDetailsContext";

export default function Provider({ children }) {
  const { user, isLoaded } = useUser();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.post("/api/user", {
          name:
            user.fullName ??
            `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          email: user.primaryEmailAddress?.emailAddress,
        });
        if (!cancelled) {
          setUserDetails(data);
          console.log("user upsert:", data);
        }
      } catch (e) {
        console.error("createNewUser failed:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, user]);

  return (
    <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserDetailsContext.Provider>
  );
}
