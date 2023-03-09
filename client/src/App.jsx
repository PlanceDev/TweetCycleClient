import styles from "./App.module.css";
import { lazy, onCleanup } from "solid-js";
import { Routes, Route, useNavigate } from "@solidjs/router";
import toast, { Toaster } from "solid-toast";
import { createEffect } from "solid-js";
import axios from "axios";
import { useUser } from "./stores/userStore";
import { useSubscription } from "./stores/subscriptionStore";
import { SOLID_APP_API_SERVER, SOLID_APP_MODE } from "./config";
import { HopeProvider } from "@hope-ui/solid";

// Informational pages
import PublicRoute from "./layouts/PublicRoute";
import Home from "./pages/Public/Home";
const TermsOfService = lazy(() => import("./pages/Public/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/Public/PrivacyPolicy"));

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
import ThreadGenerator from "./pages/Protected/ThreadGenerator";
import TwitterRedirect from "./pages/Protected/TwitterRedirect";
import Account from "./pages/Protected/Account";
import Billing from "./pages/Protected/Account/Billing";
import CheckoutSuccess from "./pages/Protected/Account/Billing/CheckoutSuccess";
import Leads from "./pages/Protected/Leads";
import ViewLead from "./pages/Protected/Leads/ViewLead";
import Contacts from "./pages/Protected/Contacts";
// import ViewContact from "./pages/Protected/Contacts/ViewContact";

function App() {
  const navigate = useNavigate();
  const [user, { logoutUser }] = useUser();
  const [subscription, { clearSubscription }] = useSubscription();

  // Add the authorization header to every request
  axios.interceptors.request.use(
    async (config) => {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${localStorage.getItem(
          "accessToken"
        )}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // add an interceptor to check for errors in responses
  axios.interceptors.response.use(
    async (response) => {
      return response;
    },
    async (error) => {
      // If the user is not authenticated, redirect them to the login page
      if (error.response.status === 440) {
        if (user) {
          logoutUser();
        }
        clearSubscription();
        toast.error("Your session has expired. Please log in again.");
        navigate("/auth/login?expired=true");
        return Promise.reject(error);
      }

      // If the users subscription has expired, redirect them to the billing page
      if (error.response.status === 402) {
        navigate("/a/account/billing");

        toast.error(
          "Your subscription has expired. Please renew your subscription."
        );
        return Promise.reject(error);
      }

      // return the error response
      return error.response;
    }
  );

  return (
    <>
      <HopeProvider>
        <Routes>
          <Route path="/" element={<PublicRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
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
            <Route path="/thread-generator" element={<ThreadGenerator />} />

            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/:id" element={<ViewLead />} />

            <Route path="/contacts" element={<Contacts />} />
            {/* <Route path="/contacts/:id" element={<ViewContact />} /> */}

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
      </HopeProvider>
    </>
  );
}

export default App;
