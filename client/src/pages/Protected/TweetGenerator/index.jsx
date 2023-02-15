import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import { promptStyles } from "./promptStyles";
import { ActionPill } from "../../../components/Styles";
import { AiOutlineSend } from "solid-icons/ai";
import { useTweet } from "../../../stores/tweetStore";
import { useDrawer } from "../../../stores/rightDrawerStore";
import { Box, LinearProgress } from "@suid/material";
import { Skeleton, Stack } from "@suid/material";

export default function TweetGenerator() {
  const [tweet, { initializeTweet }] = useTweet();
  const [rightDrawer, { openRightDrawer }] = useDrawer();
  const [selectedStyles, setSelectedStyles] = createSignal([]);
  const [generatingTweets, setGeneratingTweets] = createSignal(false);
  const [generatedTweets, setGeneratedTweets] = createSignal([
    {
      id: 1,
      body: "New Year's Day is the first day of the year, or January 1, in the Gregorian calendar.",
      attachments: [],
    },
    {
      id: 2,
      body: "New Year's Day is the first day of the year, or January 1, in the Gregorian calendar.",
      attachments: [],
    },
    {
      id: 3,
      body: "New Year's Day is the first day of the year, or January 1, in the Gregorian calendar.",
      attachments: [],
    },
    {
      id: 4,
      body: "New Year's Day is the first day of the year, or January 1, in the Gregorian calendar.",
      attachments: [],
    },
    {
      id: 5,
      body: "New Year's Day is the first day of the year, or January 1, in the Gregorian calendar.",
      attachments: [],
    },
    {
      id: 6,
      body: "New Year's Day is the first day of the year, or January 1, in the Gregorian calendar.",
      attachments: [],
    },
  ]);

  const handleStyleChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedStyles([...selectedStyles(), name]);
    } else {
      setSelectedStyles(selectedStyles().filter((style) => style !== name));
    }
  };

  const handleGenerateTweets = (e) => {
    e.preventDefault();
    console.log("Generating tweets...");
    setGeneratingTweets(true);

    setTimeout(() => {
      setGeneratingTweets(false);
    }, 2000);
  };

  const handleEditTweet = (body) => {
    initializeTweet({
      id: Math.floor(Math.random() * 1000000),
      publishDate: new Date(),
      thread: [
        {
          id: 0,
          body,
          attachments: [],
        },
      ],
    });
    openRightDrawer();
  };

  return (
    <GeneratorContainer>
      <GeneratorHeader>
        <span>Tweet Generator</span>
        <ActionPill>
          <span>Edit</span>
        </ActionPill>
      </GeneratorHeader>

      <GeneratorBody>
        <PromptSection onSubmit={(e) => handleGenerateTweets(e)}>
          <PromptInputContainer>
            <PromptInput
              placeholder={"Please enter a short topic to generate a tweet."}
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
                    <PromptTypeCheckbox
                      type="checkbox"
                      name={promptType.name}
                      checked={promptType.checked}
                      onChange={handleStyleChange}
                    />
                    {promptType.name}
                  </CheckBoxLabel>
                </CheckBoxContainer>
              )}
            </For>
          </PromptStyle>
        </PromptSection>

        <Show when={generatingTweets()}>
          <LoadingWrapper>
            {/* <LoadingTitle>Generating Tweets</LoadingTitle> */}

            <LoadingContainer>
              <For each={Array(6)}>
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

        <Show when={!generatingTweets() && generatedTweets()}>
          <GeneratedTweetsWrapper>
            <GeneratedTweetsContainer>
              <For each={generatedTweets()}>
                {(generatedTweet) => (
                  <>
                    <GeneratedTweet>
                      <TweetHeader>
                        <TweetHeaderInfo>
                          <UserAvatar>K</UserAvatar>
                          <span>@Keepah504</span>
                        </TweetHeaderInfo>
                      </TweetHeader>

                      <TweetBody>{generatedTweet.body}</TweetBody>

                      <TweetFooter>
                        <TweetFooterInfo>
                          <TweetFooterButton
                            onClick={() => handleEditTweet(generatedTweet.body)}
                          >
                            Edit & Tweet
                          </TweetFooterButton>
                        </TweetFooterInfo>
                      </TweetFooter>
                    </GeneratedTweet>
                  </>
                )}
              </For>
            </GeneratedTweetsContainer>
          </GeneratedTweetsWrapper>
        </Show>
      </GeneratorBody>
    </GeneratorContainer>
  );
}

const GeneratorContainer = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 15px;
  overflow-y: auto;
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
  height: 25px;
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
`;

const PromptStyle = styled("div")`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  color: #a3a3a3;

  @media (max-width: 868px) {
    grid-template-columns: repeat(3, 1fr);
  }

  /* make third item stretch full height of container when odd number of rows*/
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

const PromptTypeCheckbox = styled("input")`
  display: flex;
  width: 12px;
  padding: 10px;
  border: 1px solid #a3a3a3;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
`;

const LoadingWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
`;

const LoadingTitle = styled("span")`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 500;
  color: #000;
`;

const LoadingContainer = styled("div")`
  display: grid;
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

  /* grow empty spaces on last div to fill total column height*/
  /* grid-auto-rows: minmax(100px, auto); */
`;

const GeneratedTweetsWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GeneratedTweetsContainer = styled("div")`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 868px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    grid-template-columns: repeat(1, 1fr);
  }
`;

const GeneratedTweet = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-radius: 5px;
  font-size: 0.8rem !important;
  border: 1px solid #e3e3e3;
  width: 250px;
  height: 250px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 868px) {
    width: 100%;
  }
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

const TweetBody = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem !important;
  font-weight: 500;
  color: #000;
  margin-bottom: 0px;
  flex: 60%;
  padding: 10px;
`;

const TweetFooter = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  flex: 20%;
  font-size: 0.8rem !important;
  font-weight: 600;
  color: #ccc;
  border-top: 1px solid #e3e3e3;

  @media (max-width: 868px) {
    font-size: 0.9rem;
  }
`;

const TweetFooterInfo = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
  padding: 10px;

  @media (max-width: 868px) {
    font-size: 0.9rem;
  }
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
