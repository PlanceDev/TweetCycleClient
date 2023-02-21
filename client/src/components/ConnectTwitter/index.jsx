import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import axios from "axios";
import { SOLID_APP_API_SERVER } from "../../config";
import { RiDesignQuillPenFill } from "solid-icons/ri";
import { WriteTweetButton } from "../../components/Styles";

export default function ConnectTwitter() {
  const [twitterUrl, setTwitterUrl] = createSignal("");

  const handleTwitterLogin = () => {
    window.open(twitterUrl(), "_self");
  };

  onMount(() => {
    axios
      .get(`${SOLID_APP_API_SERVER}/twitter/twitter-url`, {
        withCredentials: true,
      })
      .then((res) => {
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
        <span>Sign in to Tweet</span>
      </WriteTweetButton>
    </>
  );
}
