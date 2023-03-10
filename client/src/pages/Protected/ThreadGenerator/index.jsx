import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import { promptStyles } from "./promptStyles";
import { ActionPill } from "../../../components/Styles";
import { AiOutlineSend, AiOutlineUser } from "solid-icons/ai";
import { useTweet } from "../../../stores/tweetStore";
import { useDrawer } from "../../../stores/rightDrawerStore";
import { useUser } from "../../../stores/userStore";
import { Box, LinearProgress } from "@suid/material";
import { Skeleton, Stack } from "@suid/material";

import {
  CheckboxPrimitive,
  CheckboxPrimitiveIndicator,
  Checkbox,
  CheckboxGroup,
} from "@hope-ui/solid";

import axios from "axios";
import { SOLID_APP_API_SERVER } from "../../../config";
import { toast } from "solid-toast";

export default function TweetGenerator() {
  const [tweet, { initializeTweet }] = useTweet();
  const [rightDrawer, { openRightDrawer, setRightDrawerType }] = useDrawer();
  const [user] = useUser();
  const [selectedStyles, setSelectedStyles] = createSignal([]);
  const [generatingTweets, setGeneratingTweets] = createSignal(false);
  const [prompt, setPrompt] = createSignal("");
  const [generatedThread, setGeneratedThread] = createSignal([]);

  // Add or remove styles from the selectedStyles array
  const handleStyleChange = (event) => {
    const { name, checked } = event.target;

    if (selectedStyles().length >= 3 && checked) {
      toast.error("You may only select up to 3 styles.");
      return (event.target.checked = false);
    }

    if (checked) {
      setSelectedStyles([...selectedStyles(), name]);
    } else {
      setSelectedStyles(selectedStyles().filter((style) => style !== name));
    }
  };

  // Generate tweets
  const handleGenerateTweets = (e) => {
    e.preventDefault();

    if (selectedStyles().length === 0) {
      toast.error("You must select at least 1 style.");
      return;
    }

    if (prompt().length === 0 || prompt() === " " || prompt().length < 4) {
      toast.error("You must enter a prompt with at least 4 characters.");
      return;
    }

    setGeneratingTweets(true);

    axios
      .post(
        `${SOLID_APP_API_SERVER}/tweet-generator/thread`,
        {
          prompt: prompt().trim(),
          selectedStyle: selectedStyles(),
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status !== 200) {
          return toast.error("Error generating thread, please try again.");
        }

        setGeneratedThread(res.data.thread);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setGeneratingTweets(false);
      });
  };

  // Open the right drawer and initialize the tweet with the generated tweet
  const handleEditTweet = () => {
    initializeTweet({
      id: Math.floor(Math.random() * 1000000),
      publishDate: new Date(),
      thread: generatedThread(),
    });

    setRightDrawerType("createTweet");
    openRightDrawer();
  };

  return (
    <GeneratorContainer>
      <GeneratorHeader>
        <span>Thread Generator</span>
      </GeneratorHeader>

      <GeneratorBody>
        <PromptSection onSubmit={(e) => handleGenerateTweets(e)}>
          <PromptInputContainer>
            <PromptInput
              placeholder={
                "Enter a topic you would like to create threads about..."
              }
              onChange={(e) => setPrompt(e.target.value)}
            />

            <PromptButton>
              <AiOutlineSend />
            </PromptButton>
          </PromptInputContainer>

          <PromptStyle>
            <For each={promptStyles}>
              {(promptType) => (
                <CheckBoxContainer>
                  <CheckBoxLabel>
                    <Checkbox
                      colorScheme="info"
                      name={promptType.name}
                      checked={selectedStyles().includes(promptType.name)}
                      onChange={handleStyleChange}
                      style={{
                        "font-size": "0.9rem",
                      }}
                    >
                      {promptType.name}
                    </Checkbox>
                  </CheckBoxLabel>
                </CheckBoxContainer>
              )}
            </For>
          </PromptStyle>
        </PromptSection>

        <Show when={generatingTweets()}>
          <LoadingWrapper>
            <LoadingContainer>
              <For each={Array(2)}>
                {() => (
                  <>
                    <Stack spacing={1}>
                      <Skeleton variant="text" width={250} />
                      <Skeleton
                        variant="rectangular"
                        width={250}
                        height={120}
                      />
                      <Skeleton variant="text" width={250} />
                    </Stack>
                  </>
                )}
              </For>
            </LoadingContainer>
          </LoadingWrapper>
        </Show>

        <Show when={!generatingTweets() && generatedThread().length === 0}>
          <NoTweetsWrapper>
            <NoTweetsContainer>
              <NoTweetsTitle>
                Please enter a prompt about a topic you would like to generate a
                thread for. You can select up to 3 conversation styles in which
                the AI will tone the thread.
              </NoTweetsTitle>
            </NoTweetsContainer>
          </NoTweetsWrapper>
        </Show>

        <Show when={!generatingTweets() && generatedThread().length}>
          <GeneratedTweetsWrapper>
            <GeneratedTweetsContainer>
              <GeneratedThread>
                {generatedThread().map((gThread) => (
                  <GeneratedTweet>
                    <TweetHeader>
                      <TweetHeaderInfo>
                        <UserAvatar>
                          <Show when={user.profilePicture}>
                            <img
                              src={user.profilePicture}
                              alt="Profile Picture"
                            />
                          </Show>

                          <Show when={!user.profilePicture}>
                            <AiOutlineUser />
                          </Show>
                        </UserAvatar>

                        <Show when={user.twitterUsername}>
                          <span>@{user.twitterUsername}</span>
                        </Show>
                      </TweetHeaderInfo>
                    </TweetHeader>

                    {gThread.body}
                  </GeneratedTweet>
                ))}

                <TweetFooterButton onClick={() => handleEditTweet()}>
                  Edit & Tweet
                </TweetFooterButton>
              </GeneratedThread>
            </GeneratedTweetsContainer>
          </GeneratedTweetsWrapper>
        </Show>
      </GeneratorBody>
    </GeneratorContainer>
  );
}

const NoTweetsWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const NoTweetsContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 75%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const NoTweetsTitle = styled("span")`
  font-size: 1rem;
  color: #000000;
`;

const GeneratorContainer = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 15px;
  overflow-y: auto;
  font-family: "Poppins", sans-serif;
`;

const GeneratorHeader = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 50px;
`;

const GeneratorBody = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;
  margin-bottom: 10% !important;
`;

const PromptSection = styled("form")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 10px;
  font-size: 0.8rem !important;
  margin-bottom: 20px;
`;

const PromptInputContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
`;

const PromptInput = styled("input")`
  width: 600px;
  height: 50px;
  padding: 10px;
  border: 1px solid #e3e3e3;
  border-radius: 3px;
  font-size: 0.8rem;
  outline: none;
  background-color: #fafafa !important;

  @media (max-width: 868px) {
    width: 100%;
  }
`;

const PromptButton = styled("button")`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  color: #a3a3a3;

  &:hover {
    background-color: #fff;
    color: #1da1f2;
  }

  &:focus {
    outline: none;
  }
`;

const PromptStyle = styled("div")`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  color: #a3a3a3;

  @media (max-width: 868px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CheckBoxContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CheckBoxLabel = styled("label")`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */

  @media (max-width: 868px) {
    font-size: 0.9rem;
  }
`;

const LoadingWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
`;

const LoadingContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
  color: #1d9bf0;

  @media (max-width: 868px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    grid-template-columns: repeat(1, 1fr);
  }
`;

const GeneratedTweetsWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GeneratedTweetsContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const GeneratedThread = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 0.8rem !important;
  width: 350px;
  padding: 20px;
  border: none;
  border-left: 2px solid #1d9bf0;

  @media (max-width: 868px) {
    width: 100%;
  }
`;

const GeneratedTweet = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e3e3e3;
  padding: 10px;
  gap: 10px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
`;

const UserAvatar = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: #1d9bf0;
  transition: all 0.3s ease-in-out;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fafafa;
`;

const TweetHeader = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  flex: 20%;
  font-size: 0.8rem !important;
  font-weight: 600;
  color: #ccc;
  border-bottom: 1px solid #e3e3e3;
`;

const TweetHeaderInfo = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 10px;
  color: #000;
`;

const TweetFooterButton = styled("button")`
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 5px;
  padding: 10px;
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  font-size: 0.8rem !important;
  font-weight: 600;
  color: #000;
  border-radius: 5px;
  border: 1px solid #e3e3e3;

  &:hover {
    color: #1da1f2;
  }

  @media (max-width: 868px) {
    font-size: 0.9rem;
  }
`;
