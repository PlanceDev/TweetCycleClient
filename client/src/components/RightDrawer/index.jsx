import { styled } from "solid-styled-components";
import { createSignal, For, Show, onMount } from "solid-js";
import { Fade } from "@suid/material";
import TimePicker from "../TimePicker";
import { Box, Button, Drawer } from "@suid/material";
import { toast } from "solid-toast";

import { HiSolidLogout } from "solid-icons/hi";
import { AiFillTool } from "solid-icons/ai";
import { BiRegularImageAdd } from "solid-icons/bi";
import { OcSmiley2 } from "solid-icons/oc";
import { FaSolidRobot } from "solid-icons/fa";
import { FaRegularTrashCan } from "solid-icons/fa";

import { useTweet } from "../../stores/tweetStore";
import { useDrawer } from "../../stores/rightDrawerStore";
import { useSchedule } from "../../stores/scheduleStore";

import Emojis from "../Emojis";

export default function TemporaryDrawer() {
  const [isSchedule, setIsSchedule] = createSignal(false);
  const [showEmojis, setShowEmojis] = createSignal(false);
  const [selectedThread, setSelectedThread] = createSignal(0);

  const [scheduledTweets, { addScheduledTweets, editScheduledTweets }] =
    useSchedule();

  const [rightDrawer, { closeRightDrawer }] = useDrawer();

  const [
    tweet,
    { addThread, handleBodyChange, removeTweet, handleImageUpload },
  ] = useTweet();

  const handleToggleEmojis = (id) => {
    setShowEmojis(!showEmojis());
    setSelectedThread(id);
  };

  const handleEmojiClick = (emoji) => {
    handleBodyChange(
      { target: { value: tweet.thread[selectedThread()].body + emoji.native } },
      selectedThread()
    );
  };

  const handleImageUploadClick = (e, id) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = (e) => handleImageUpload(e, id);
    fileInput.click();
  };

  const HandleTextInput = (e) => {
    handleBodyChange(e, selectedThread());
  };

  const handleScheduleTweet = () => {
    addScheduledTweets({ ...tweet });
    toast.success("Tweet scheduled successfully!");
    closeRightDrawer();
  };

  const handleTweetNow = () => {
    toast.success("Successfully tweeted!");
    closeRightDrawer();
  };

  const handleEditScheduledTweet = () => {
    editScheduledTweets(tweet.id, { ...tweet });
    toast.success("Tweet updated successfully!");
    closeRightDrawer();
  };

  const drawer = () => (
    <Box sx={{ width: 400 }} role="presentation">
      <DrawerContainer>
        <DrawerHeader>
          <Show
            when={rightDrawer.type === "edit"}
            fallback={<h3>Create a Tweet</h3>}
          >
            <h3>Edit Scheduled Tweet</h3>
          </Show>
        </DrawerHeader>

        <DrawerMiddle>
          <TweetDiv>
            <For each={tweet.thread}>
              {(item) => (
                <>
                  <TweetTextArea
                    key={item.id}
                    placeholder="Write your tweet here."
                    value={item.body}
                    onChange={HandleTextInput}
                    onFocus={() => setSelectedThread(item.id)}
                  />

                  <RemainingCharactersDiv>
                    <RemainingCharactersSpan>
                      {item.body.length} / 280 characters
                    </RemainingCharactersSpan>

                    <TweetActionsDiv>
                      <FaSolidRobot />

                      <BiRegularImageAdd
                        onClick={(e) => handleImageUploadClick(e, item.id)}
                      />
                      <OcSmiley2 onClick={() => handleToggleEmojis(item.id)} />

                      <Show when={tweet.thread.length > 1 && item.id !== 0}>
                        <FaRegularTrashCan
                          onClick={() => removeTweet(item.id)}
                        />
                      </Show>
                    </TweetActionsDiv>
                  </RemainingCharactersDiv>

                  <Show when={showEmojis() && selectedThread() === item.id}>
                    <Emojis onPickEmoji={handleEmojiClick} />
                  </Show>
                </>
              )}
            </For>
          </TweetDiv>
        </DrawerMiddle>

        <BottomDiv>
          <ActionDiv>
            <AddButton onClick={() => addThread()}>
              <span>+ thread</span>
            </AddButton>
          </ActionDiv>

          {rightDrawer.type === "edit" ? (
            <>
              <TimePicker />
              <ScheduleTweetNowDiv>
                <CancelButton onClick={closeRightDrawer}>Cancel</CancelButton>
                <SubmitButton onClick={handleEditScheduledTweet}>
                  Save Tweet
                </SubmitButton>
              </ScheduleTweetNowDiv>
            </>
          ) : (
            <>
              <Show when={isSchedule()}>
                <TimePicker />

                <Show when={isSchedule()}>
                  <Fade in={isSchedule()}>
                    <ScheduleTweetNowDiv>
                      <CancelButton
                        onClick={() => setIsSchedule(!isSchedule())}
                      >
                        Cancel
                      </CancelButton>

                      <SubmitButton onClick={() => handleScheduleTweet()}>
                        Schedule Tweet
                      </SubmitButton>
                    </ScheduleTweetNowDiv>
                  </Fade>
                </Show>
              </Show>

              <Show when={!isSchedule()}>
                <Fade in={!isSchedule()}>
                  <TweetButtonsDiv>
                    <ScheduleButton
                      onClick={() => setIsSchedule(!isSchedule())}
                    >
                      Tweet Later
                    </ScheduleButton>

                    <SubmitButton onClick={() => handleTweetNow()}>
                      Tweet Now
                    </SubmitButton>
                  </TweetButtonsDiv>
                </Fade>
              </Show>
            </>
          )}
        </BottomDiv>

        <DrawerBottom onClick={closeRightDrawer}>
          <HiSolidLogout />
          <span>Collapse</span>
        </DrawerBottom>
      </DrawerContainer>
    </Box>
  );

  return (
    <div>
      <Drawer anchor={"right"} open={rightDrawer.open}>
        {drawer()}
      </Drawer>
    </div>
  );
}

const DrawerContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`;

const DrawerHeader = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5vh;
  padding: 10px;
  color: #788fa1;
  /* background-color: #0f1419; */
  border-bottom: 0.1rem solid #788fa147;
`;

const DrawerMiddle = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90vh;
  color: #788fa1;
  border-bottom: 0.1rem solid #788fa147;
  padding: 0px 20px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const BottomDiv = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: fit-content;
  padding: 10px;
  gap: 10px;
  color: #788fa1;
  /* background-color: #0f1419; */
  border-bottom: 0.1rem solid #788fa147;
`;

const RemainingCharactersDiv = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: space-between;
  margin-top: 5px;
  color: #ccc;
`;

const RemainingCharactersSpan = styled("span")`
  font-size: 0.8rem;
  margin-right: 5px;
`;

const TweetActionsDiv = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;

  svg {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1d9bf0;
    padding: 5px;
    border-radius: 5px;
    font-size: 1rem;
    color: #fff !important;
    cursor: pointer;
  }
`;

const ActionDiv = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  svg {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    border-radius: 2px;
    font-size: 1rem;
    color: #fff !important;
  }
`;

const AddButton = styled("button")`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  color: #1da1f2;
  font-weight: bold;
  border: 1px dotted #1da1f2;
  border-radius: 2px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: fit-content;
  padding: 5px 10px;

  /* svg {
    font-size: 0.8rem;
    color: #1da1f2 !important;
  } */

  &:hover {
    background-color: #1a91da;
    color: #fff;
  }
`;

const RemoveButton = styled("button")`
  background-color: #fff;
  color: #1da1f2;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 0.8rem;
  margin-left: auto;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const DrawerBottom = styled("div")`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 5vh;
  color: #788fa1;
  border-bottom: 0.1rem solid #788fa147;
  cursor: pointer;
  padding: 0 10px;

  svg {
    font-size: 1.5rem;
    margin-right: 5px;
  }
`;

const TweetTextArea = styled("textarea")`
  height: 100px;
  border-radius: 5px;
  border: 2px solid #ccc;
  resize: none;
  font-size: 0.9rem;
  padding: 10px;
  color: #000;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.00938em;
  overflow: hidden;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  word-break: break-word;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border: 2px solid #178bd3;
  }

  &::placeholder {
    color: #788fa1;
  }

  @media screen and (max-width: 768px) {
    height: 125px;
    font-size: 1.1rem;
  }
`;

const TweetDiv = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
  padding: 20px;
  width: 100%;
  gap: 10px;
  height: fit-content;
`;

const TweetButtonsDiv = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

const SubmitButton = styled("button")`
  background-color: #178bd3;
  border-radius: 5px;
  border: none;
  width: 50%;
  color: #fff;
  border-radius: 2px;
  padding: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #1a91da;
  }
`;

const ScheduleTweetNowDiv = styled("div")`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

const ScheduleButton = styled("button")`
  width: 50%;
  background-color: #788fa1;

  border: none;
  color: #fff;
  border-radius: 2px;
  padding: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #8da4b8;
  }
`;

const CancelButton = styled("button")`
  background-color: #788fa1;
  border-radius: 5px;
  border: none;
  width: 50%;
  color: #fff;
  border-radius: 2px;
  padding: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #8da4b8;
  }
`;
