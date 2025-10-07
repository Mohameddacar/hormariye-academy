import { createContext, useContext } from "react";

export const UserDetailsContext = createContext({
  userDetails: null,
  setUserDetails: () => {},
});

export const useUserDetails = () => useContext(UserDetailsContext);
