import styles from "./App.module.css";
import { lazy } from "solid-js";
import { Routes, Route, useNavigate } from "@solidjs/router";
import { Toaster } from "solid-toast";

// Informational pages
import PublicRoute from "./layouts/PublicRoute";
import Home from "./pages/Public/Home";

// Authentication pages
import AuthRoute from "./layouts/AuthRoute";
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/Auth/VerifyEmail"));
const ResendVerificationEmail = lazy(() =>
  import("./pages/Auth/ResendVerificationEmail")
);

// Pages only visible to authenticated users
import ProtectedRoute from "./layouts/ProtectedRoute";
import Schedule from "./pages/Protected/Schedule";
import Published from "./pages/Protected/Published";
import Drafts from "./pages/Protected/Drafts";
import TweetGenerator from "./pages/Protected/TweetGenerator";
import TwitterRedirect from "./pages/Protected/TwitterRedirect";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route path="/auth" element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/resend-email" element={<ResendVerificationEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="/a" element={<ProtectedRoute />}>
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/drafts" element={<Drafts />} />
          <Route path="/published" element={<Published />} />
          <Route path="/tweet-generator" element={<TweetGenerator />} />
          <Route path="/twitter-redirect" element={<TwitterRedirect />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
