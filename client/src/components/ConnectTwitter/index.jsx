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
    window.open(twitterUrl(), "_self");
  };

  createEffect(() => {
    if (!user.isAuth) return;

    axios
      .get(`${SOLID_APP_API_SERVER}/twitter/twitter-url`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status !== 200) {
          return;
          // return toast.error("Something went wrong! Please try again later.");
        }
        setTwitterUrl(res.data);
      })
      .catch((err) => {
        return;
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
