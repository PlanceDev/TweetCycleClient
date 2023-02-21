import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export const UserContext = createContext({});

export function UserProvider(props) {
  const [user, setUser] = createStore({
    _id: localStorage.getItem("_id") || "",
    firstName: localStorage.getItem("firstName") || "",
    lastName: localStorage.getItem("lastName") || "",
    email: localStorage.getItem("email") || "",
    createdAt: localStorage.getItem("createdAt") || "",
    twitterId: localStorage.getItem("twitterId") || "",
    twitterUsername: localStorage.getItem("twitterUsername") || "",
    isEmailVerified: localStorage.getItem("isEmailVerified") || false,
    isAuth: localStorage.getItem("isAuth") || false,
  });

  const userActions = [
    user,
    {
      // Initialize the user
      initializeUser(user) {
        localStorage.setItem("_id", user._id);
        localStorage.setItem("firstName", user.firstName);
        localStorage.setItem("lastName", user.lastName);
        localStorage.setItem("email", user.email);
        localStorage.setItem("createdAt", user.createdAt);
        localStorage.setItem("twitterId", user.twitterId || "");
        localStorage.setItem("twitterUsername", user.twitterUsername || "");
        localStorage.setItem("isEmailVerified", user.isEmailVerified);
        localStorage.setItem("isAuth", true);

        setUser(user);
      },

      // Update the user
      updateUser(e) {
        setUser({ [e.target.name]: e.target.value });
      },

      // Logout the user
      logoutUser() {
        localStorage.clear();

        setUser({
          _id: "",
          firstName: "",
          lastName: "",
          email: "",
          createdAt: "",
          twitterId: "",
          twitterUsername: "",
          isEmailVerified: false,
          isAuth: false,
        });
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
