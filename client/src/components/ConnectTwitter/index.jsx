import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import axios from "axios";
import { SOLID_APP_API_SERVER } from "../../config";
import { RiDesignQuillPenFill } from "solid-icons/ri";
import { WriteTweetButton } from "../../components/Styles";
import { toast } from "solid-toast";
import { useUser } from "../../stores/userStore";

export default function ConnectTwitter() {
  const [twitterUrl, setTwitterUrl] = createSignal("");
  const [user, { initializeUser }] = useUser();

  const handleTwitterLogin = () => {
    console.log(twitterUrl());
    window.open(twitterUrl(), "_self");
  };

  onMount(() => {
    axios
      .get(`${SOLID_APP_API_SERVER}/twitter/twitter-url`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status !== 200) {
          console.log(res);
        }

        setTwitterUrl(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <>
      <WriteTweetButton onClick={handleTwitterLogin}>
        <RiDesignQuillPenFill />
        <span>Connect Twitter</span>
      </WriteTweetButton>
    </>
  );
}
