import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export const UserContext = createContext({});

export function UserProvider(props) {
  const [user, setUser] = createStore({
    twitterId: localStorage.getItem("twitterId") || "",
    twitterUsername: localStorage.getItem("twitterUsername") || "",
    email: localStorage.getItem("email") || "",
    isAuth: localStorage.getItem("isAuth") || true,
  });

  const userActions = [
    user,
    {
      // Initialize the user
      initializeUser(user) {
        setUser(user);
      },

      // Update the user
      updateUser(e) {
        setUser({ [e.target.name]: e.target.value });
      },

      // Login the user
      loginUser() {
        setUser({ isAuth: true });
      },
    },
  ];

  return (
    <UserContext.Provider value={userActions}>
      {props.children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
