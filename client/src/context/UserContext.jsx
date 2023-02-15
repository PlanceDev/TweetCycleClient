import { createSignal, createContext, useContext } from "solid-js";

const UserContext = createContext();

export function UserContextProvider(props) {
  const [user, setUser] = createSignal({
    twitterId: localStorage.getItem("twitterId") || "",
    twitterUsername: localStorage.getItem("twitterUsername") || "",
    email: localStorage.getItem("email") || "",
    isAuth: localStorage.getItem("isAuth") || false,
  });

  return (
    <UserContext.Provider value={[user, setUser]}>
      {props.children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
