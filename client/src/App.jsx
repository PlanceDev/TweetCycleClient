import styles from "./App.module.css";
import { lazy, onCleanup } from "solid-js";
import { Routes, Route, useNavigate } from "@solidjs/router";
import { Toaster } from "solid-toast";
import { createEffect } from "solid-js";

// Informational pages
import PublicRoute from "./layouts/PublicRoute";
import Home from "./pages/Public/Home";
const TermsOfService = lazy(() => import("./pages/Public/TermsOfService"));

// Authentication pages
import AuthRoute from "./layouts/AuthRoute";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
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
import Account from "./pages/Protected/Account";
import Billing from "./pages/Protected/Account/Billing";
import CheckoutSuccess from "./pages/Protected/Account/Billing/CheckoutSuccess";
import { SOLID_APP_API_SERVER, SOLID_APP_MODE } from "./config";

import axios from "axios";
import { useUser } from "./stores/userStore";
import { useSubscription } from "./stores/subscriptionStore";

function App() {
  const navigate = useNavigate();
  const [user, { logoutUser }] = useUser();
  const [subscription, { clearSubscription }] = useSubscription();

  // add an interceptor to check for errors in responses
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status.toString() === "440") {
        logoutUser();
        clearSubscription();
        navigate("/auth/login?expired=true");
        return error;
      }

      return error;
    }
  );

  // createEffect(() => {
  //   let ws;

  //   if (SOLID_APP_MODE === "development") {
  //     ws = new WebSocket(`ws://${SOLID_APP_API_SERVER.split("://")[1]}`);
  //   } else {
  //     ws = new WebSocket(`wss://${SOLID_APP_API_SERVER.split("://")[1]}`);
  //   }

  //   ws.onopen = () => {
  //     console.log("Connected to server");
  //   };

  //   ws.onmessage = (event) => {
  //     console.log(`Received message: ${event.data}`);
  //     setMessage(event.data);
  //   };

  //   ws.onclose = () => {
  //     console.log("Disconnected from server");
  //   };

  //   // Clean up the WebSocket connection when the component is unmounted
  //   onCleanup(() => {
  //     ws.close();
  //   });
  // });

  return (
    <>
      <Routes>
        <Route path="/" element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
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
          <Route path="/account" element={<Account />} />
          <Route path="/account/billing" element={<Billing />} />
          <Route
            path="/account/billing/checkout-success"
            element={<CheckoutSuccess />}
          />
        </Route>
      </Routes>
      <Toaster position="bottom-left" />
    </>
  );
}

export default App;
