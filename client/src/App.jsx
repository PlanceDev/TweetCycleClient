import styles from "./App.module.css";
import { lazy } from "solid-js";
import { Routes, Route, useNavigate } from "@solidjs/router";
import { Toaster } from "solid-toast";

// Informational pages
import PublicRoute from "./layouts/PublicRoute";

// Authentication pages
import AuthRoute from "./layouts/AuthRoute";

// Pages only visible to authenticated users
import ProtectedRoute from "./layouts/ProtectedRoute";
import Schedule from "./pages/Protected/Schedule";
import TweetGenerator from "./pages/Protected/TweetGenerator";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PublicRoute />}></Route>

        <Route path="/auth" element={<AuthRoute />}></Route>

        <Route path="/a" element={<ProtectedRoute />}>
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/tweet-generator" element={<TweetGenerator />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
