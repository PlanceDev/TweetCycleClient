import { createEffect, createSignal, Show, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import axios from "axios";
import { toast } from "solid-toast";
import { SOLID_APP_API_SERVER } from "../../../config";
import { useUser } from "../../../stores/userStore";

export default function TwitterRedirect() {
  const navigate = useNavigate();
  const [user, { initializeUser }] = useUser();

  createEffect(() => {
    let token = new URLSearchParams(window.location.search).get("oauth_token");
    let verifier = new URLSearchParams(window.location.search).get(
      "oauth_verifier"
    );

    if (!token || !verifier) return;

    axios
      .post(
        `${SOLID_APP_API_SERVER}/twitter/connect-twitter`,
        {
          oauthToken: token,
          verifier: verifier,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Twitter connected!");
        initializeUser(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong! Please try again later!");
      })
      .finally(() => {
        navigate("/a/schedule");
      });
  });

  return <></>;
}
