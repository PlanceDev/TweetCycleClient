import { styled } from "solid-styled-components";
import { createSignal, For, Show, onMount, createEffect } from "solid-js";
import { Fade } from "@suid/material";
import TimePicker from "../TimePicker";
import { CircularProgress } from "@suid/material";
import { Box, Button, Drawer } from "@suid/material";
import { toast } from "solid-toast";
import axios from "axios";

import { Tooltip } from "@hope-ui/solid";
import { HiSolidLogout } from "solid-icons/hi";
import { AiFillTool } from "solid-icons/ai";
import { BiRegularImageAdd } from "solid-icons/bi";
import { OcSmiley2 } from "solid-icons/oc";
import { FaSolidRobot } from "solid-icons/fa";
import { FaRegularTrashCan } from "solid-icons/fa";
import { ImAttachment } from "solid-icons/im";

import { useTweet } from "../../stores/tweetStore";
import { useDrawer } from "../../stores/rightDrawerStore";
import { useSchedule } from "../../stores/scheduleStore";
import { useUser } from "../../stores/userStore";

import Emojis from "../Emojis";

import { SOLID_APP_API_SERVER } from "../../config";

export default function TemporaryDrawer() {
  const [user] = useUser();
  const [isSchedule, setIsSchedule] = createSignal(false);
  const [showEmojis, setShowEmojis] = createSignal(false);
  const [selectedThread, setSelectedThread] = createSignal(0);
  const [loading, setLoading] = createSignal(false);
  const [isScheduling, setIsScheduling] = createSignal(false);
  const [removedImages, setRemovedImages] = createSignal([]);
  const [newImages, setNewImages] = createSignal([]);
  const [isImproving, setIsImproving] = createSignal(false);

  const [rightDrawer, { closeRightDrawer, setRightDrawerType }] = useDrawer();
  const [scheduledTweets, { addScheduledTweets, editScheduledTweets }] =
    useSchedule();

  const [
    tweet,
    {
      addThread,
      handleBodyChange,
      removeTweet,
      handleImageUpload,
      removeImage,
    },
  ] = useTweet();

  // Handle the text input
  const HandleTextInput = (e) => {
    handleBodyChange(e, selectedThread());
  };

  // Open the drawer when the user clicks on the emoji button
  const handleToggleEmojis = (id) => {
    setSelectedThread(id);
    setShowEmojis(!showEmojis());
  };

  // Select an emoji and add it to the tweet body
  const handleEmojiClick = (emoji) => {
    handleBodyChange(
      {
        target: {
          value: tweet.thread[selectedThread()].body + emoji.native,
        },
      },
      selectedThread()
    );
  };

  // Handle the image upload
  const handleEditImageUpload = async (name, b64, id) => {
    const image = {
      thread: id,
      name,
      b64,
    };

    setNewImages([...newImages(), image]);
  };

  // Handle the image upload
  const handleImageUploadClick = async (e, id) => {
    if (tweet.thread[id].attachments.length >= 4) {
      toast.error("You can only upload 4 images per tweet.");
      return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.click();

    const checkAndUpload = async (e, id) => {
      if (fileInput.size > 5242880) {
        toast.error("File size is too large. File must be less than 5MB.");
        return;
      }

      const file = e.target.files[0];
      const fileData = await readImageFile(file);
      const base64Image = fileData.split(",")[1];

      // check if the file is an image
      if (!file.type.startsWith("image/")) {
        toast.error("You may only upload valid image files.");
        return;
      }

      function readImageFile(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = () => {
            resolve(reader.result);
          };

          reader.onerror = (error) => {
            reject(error);
          };
        });
      }

      if (rightDrawer.type === "edit") {
        await handleEditImageUpload(file.name, base64Image, id);
      }

      handleImageUpload(file.name, base64Image, id);
    };

    fileInput.onchange = (e) => checkAndUpload(e, id);
  };

  // Handle the remove image button
  const handleRemoveImage = (id, index, key, name) => {
    if (rightDrawer.type === "edit") {
      setRemovedImages([...removedImages(), key]);
      setNewImages(newImages().filter((image) => image.name !== name));
    }

    removeImage(id, index, key);
  };

  // Handle the schedule tweet button
  const handleScheduleTweet = () => {
    if (!user.twitterId)
      return toast.error("Please connect your Twitter account.");

    setLoading(true);
    setIsScheduling(true);

    axios
      .post(
        `${SOLID_APP_API_SERVER}/tweet`,
        { ...tweet, type: "schedule-tweet" },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 400) {
          toast.error("Tweets can not be empty. Please add some text.");
          return;
        }

        if (res.status !== 200) {
          toast.error("Something went wrong. Please try again.");
          return;
        }
        toast.success("Tweet scheduled successfully!");
        // addScheduledTweets({ ...tweet });
        addScheduledTweets(res.data.tweet);
        closeRightDrawer();
        setRightDrawerType("createTweet");
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
      })
      .finally(() => setLoading(false))
      .finally(() => setIsScheduling(false));
  };

  // Handle the tweet now button
  const handleTweetNow = () => {
    if (!user.twitterId)
      return toast.error("Please connect your Twitter account.");

    setLoading(true);

    axios
      .post(
        `${SOLID_APP_API_SERVER}/tweet`,
        { ...tweet, type: "tweet-now" },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 400) {
          toast.error("Tweets can not be empty. Please add some text.");
          return;
        }

        if (res.status !== 200 && res.status !== 201) {
          toast.error("Something went wrong. Please try again.");
          return;
        }

        toast.success("Successfully tweeted!");
        closeRightDrawer();
        setRightDrawerType("createTweet");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  // Handle the edit scheduled tweet button
  const handleEditScheduledTweet = (id) => {
    if (!user.twitterId)
      return toast.error("Please connect your Twitter account.");

    const body = {
      ...tweet,
      removedImages: removedImages(),
      newImages: newImages(),
      type: "edit-scheduled-tweet",
    };

    setLoading(true);
    setIsScheduling(true);

    axios
      .put(`${SOLID_APP_API_SERVER}/tweet/${tweet._id}`, body, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status !== 200) {
          toast.error("Something went wrong. Please try again.");
          return;
        }
        editScheduledTweets(id, { ...tweet });
        toast.success("Tweet updated successfully!");
        closeRightDrawer();
        setRemovedImages([]);
        setNewImages([]);
        setRightDrawerType("createTweet");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong. Please try again.");
      })
      .finally(() => {
        setLoading(false);
        setIsScheduling(false);
      });
  };

  // Function for improving the tweet using the AI
  const handleImprovedTweet = (item) => {
    if (!user.twitterId)
      return toast.error("Please connect your Twitter account.");

    if (!item.body) return toast.error("Tweet can not be empty.");

    setIsImproving(true);

    axios
      .post(`${SOLID_APP_API_SERVER}/tweet-generator/improve`, item, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status !== 200) {
          toast.error("Something went wrong. Please try again.");
          return;
        }

        let e = {
          target: {
            value: res.data.result,
          },
        };

        handleBodyChange(e, selectedThread());
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong. Please try again.");
      })
      .finally(() => {
        setIsImproving(false);
      });
  };

  const handleCloseDrawer = () => {
    closeRightDrawer();
    setShowEmojis(false);
    setIsSchedule(false);
    setNewImages([]);
    setRemovedImages([]);
    setRightDrawerType("createTweet");
  };

  const drawer = () => (
    <Box sx={{ width: 350 }} role="presentation">
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
          {loading() || isImproving() ? (
            <>
              <div
                style={{
                  display: "flex",
                  "flex-direction": "column",
                  "justify-content": "center",
                  "align-items": "center",
                  height: "100%",
                  gap: "1rem",
                }}
              >
                <CircularProgress />

                <span>
                  <strong>
                    <Show when={isScheduling() && !isImproving()}>
                      Scheduling...
                    </Show>

                    <Show when={!isImproving() && !isScheduling()}>
                      Tweeting...
                    </Show>

                    <Show when={isImproving() && !isScheduling()}>
                      Improving tweet...
                    </Show>
                  </strong>
                </span>
              </div>
            </>
          ) : (
            <>
              <TweetDiv>
                <For each={tweet.thread}>
                  {(item, index) => (
                    <>
                      <TweetTextArea
                        key={item.id}
                        placeholder="Write your tweet here."
                        value={item.body}
                        onChange={HandleTextInput}
                        onFocus={() => setSelectedThread(item.id)}
                        onMouseClickOutside={() => {
                          document.activeElement.blur();
                        }}
                      />

                      <Show when={item.attachments.length > 0}>
                        <AttachmentDiv>
                          <For each={item.attachments}>
                            {(attachment) => (
                              <>
                                <AttachmentIcon>
                                  <div
                                    style={{
                                      display: "flex",
                                      "align-items": "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <ImAttachment />
                                    {attachment.name.substring(0, 10) +
                                      "..." +
                                      attachment.name.substring(
                                        attachment.name.length - 4,
                                        attachment.name.length
                                      )}
                                  </div>

                                  <AttachmentRemoveButton
                                    onClick={() =>
                                      handleRemoveImage(
                                        index(),
                                        item.id,
                                        attachment.key,
                                        attachment.name
                                      )
                                    }
                                  >
                                    <FaRegularTrashCan />
                                  </AttachmentRemoveButton>
                                </AttachmentIcon>
                              </>
                            )}
                          </For>
                        </AttachmentDiv>
                      </Show>

                      <RemainingCharactersDiv>
                        <RemainingCharactersSpan>
                          {item.body.length} / 280 characters
                        </RemainingCharactersSpan>

                        <TweetActionsDiv>
                          <Tooltip
                            withArrow
                            label="Use our AI to improve this tweet."
                            placement="left"
                            openDelay={300}
                          >
                            <TweetAction
                              onClick={() => handleImprovedTweet(item)}
                            >
                              <FaSolidRobot />
                            </TweetAction>
                          </Tooltip>

                          <TweetAction
                            onClick={(e) => handleImageUploadClick(e, item.id)}
                          >
                            <BiRegularImageAdd />
                          </TweetAction>

                          <TweetAction
                            onClick={() => handleToggleEmojis(item.id)}
                          >
                            <OcSmiley2 />
                          </TweetAction>

                          <Show when={tweet.thread.length > 1 && item.id !== 0}>
                            <TweetAction onClick={() => removeTweet(item.id)}>
                              <FaRegularTrashCan />
                            </TweetAction>
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
            </>
          )}
        </DrawerMiddle>

        <Show when={!loading()}>
          <BottomDiv>
            <ActionDiv>
              <AddButton onClick={() => addThread()}>
                <span>+ thread</span>
              </AddButton>
            </ActionDiv>

            <Show when={rightDrawer.type === "edit"}>
              <>
                <TimePicker />

                <ScheduleTweetNowDiv>
                  <CancelButton onClick={handleCloseDrawer}>
                    Cancel
                  </CancelButton>
                  <SubmitButton
                    onClick={() => handleEditScheduledTweet(tweet._id)}
                  >
                    Save Tweet
                  </SubmitButton>
                </ScheduleTweetNowDiv>
              </>
            </Show>

            <Show when={rightDrawer.type !== "edit"}>
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
            </Show>
          </BottomDiv>
        </Show>

        <DrawerBottom onClick={handleCloseDrawer}>
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
  font-family: "Poppins", sans-serif !important;
`;

const DrawerHeader = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 11vh;
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
  /* padding: 0px 20px; */
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

  /* svg {
    display: flex;
    height: 25px;
    width: 25px;
    justify-content: center;
    align-items: center;
    background-color: #1d9bf0;
    border-radius: 5px;
    font-size: 1rem;
    color: #fff !important;
    cursor: pointer;

    &:hover {
      background-color: #1da1f2;
    }
  } */
`;

const TweetAction = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25px;
  width: 25px;
  background-color: #1d9bf0;
  border-radius: 5px;
  font-size: 1rem;
  color: #fff !important;
  cursor: pointer;

  &:hover {
    background-color: #1da1f2;
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

  &:focus {
    outline: none;
  }

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
  height: 10vh;
  color: #788fa1;
  border-bottom: 0.1rem solid #788fa147;
  cursor: pointer;
  padding: 0 10px;
  transition: all 0.2s ease-in-out;

  svg {
    margin-right: 5px;
  }

  &:hover {
    background-color: #788fa147;
  }
`;

const TweetTextArea = styled("textarea")`
  height: 150px;
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

const AttachmentDiv = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0px;
  color: #000;
  border-bottom: 0.1rem solid #788fa147;
  font-size: x-small;
`;

const AttachmentIcon = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #788fa147;
  padding: 5px;
  border-radius: 3px;
  gap: 10px;
`;

const AttachmentRemoveButton = styled("button")`
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 0.8rem;

  transition: all 0.2s ease-in-out;

  &:hover {
    color: #1d9bf0;
    cursor: pointer;
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
