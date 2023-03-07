import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import moment from "moment";
import { FiEdit } from "solid-icons/fi";
import { FaRegularTrashCan } from "solid-icons/fa";
import { AiFillClockCircle } from "solid-icons/ai";
import { CircularProgress } from "@suid/material";
import { AiFillEye } from "solid-icons/ai";
import { toast } from "solid-toast";
import { useDrafted } from "../../../stores/draftedStore";
import { useTweet } from "../../../stores/tweetStore";
import { useDrawer } from "../../../stores/rightDrawerStore";
import {
  ActionPill,
  ActionPillsDiv,
  ScheduleContainer,
  ScheduleBody,
  ScheduleHeader,
  ScheduledTweet,
  TweetDay,
  TweetTime,
  TweetIsThread,
  TweetPreview,
  EditDeleteContainer,
  EditIcon,
  DeleteIcon,
  LoadingContainer,
} from "../../../components/Styles";

import axios from "axios";
import { SOLID_APP_API_SERVER } from "../../../config";
import ScheduleHistory from "../../../components/ScheduleHistory";

export default function Drafts() {
  const [loading, setLoading] = createSignal(true);
  const [rightDrawer, { openRightDrawer, setRightDrawerType }] = useDrawer();
  const [tweet, { initializeTweet }] = useTweet();
  const [draftededTweets, { initializeDraftedTweets, removeDraftedTweet }] =
    useDrafted();

  const [days, setDays] = createSignal([]);

  const handleDelete = (id) => {
    removeDraftedTweet(id);
  };

  const handleClickThread = (st) => {
    initializeTweet(st);
    setRightDrawerType("edit");
    openRightDrawer();
  };

  createEffect(() => {
    if (draftededTweets.length === 0) return;

    let weekDays = [];
    let sortedTweets = [...draftededTweets];

    sortedTweets.sort((a, b) => {
      return a.publishDate - b.publishDate;
    });

    initializeDraftedTweets(sortedTweets);

    draftededTweets.forEach((tweet) => {
      weekDays.push(moment(tweet.publishDate).format("dddd DD MMMM YYYY"));
    });

    setDays(weekDays);
  });

  onMount(async () => {
    try {
      const res = await axios.get(`${SOLID_APP_API_SERVER}/tweet/drafts`, {
        withCredentials: true,
      });

      if (res.status !== 200) {
        return toast.error(
          "Could not retrieve published tweets. Please try again later."
        );
      }

      let draftTweets = res.data.tweets;

      // get US date format
      draftTweets = draftTweets.map((tweet) => {
        return { ...tweet, publishDate: new Date(tweet.publishDate) };
      });

      draftTweets.sort((a, b) => b.publishDate - a.publishDate);

      initializeDraftedTweets(draftTweets);
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  });

  return (
    <>
      <ScheduleContainer>
        <ScheduleHistory selectedPage="Draft" />

        <ScheduleBody>
          <Show when={loading()}>
            <LoadingContainer>
              <CircularProgress />
              <p>Loading drafted tweets...</p>
            </LoadingContainer>
          </Show>

          <Show when={!loading()}>
            <Show when={draftededTweets.length === 0}>
              <p>You don't have any drafts.</p>
            </Show>

            {draftededTweets.map((st, i) => (
              <>
                <Show when={days()[i] !== days()[i - 1]}>
                  <TweetDay>
                    <Show
                      when={
                        moment(st.publishDate).format("dddd") ===
                        moment(new Date()).format("dddd")
                      }
                      fallback={moment(st.publishDate).format("dddd")}
                    >
                      Today
                    </Show>{" "}
                    | {moment(st.publishDate).format("MMMM DD")}
                  </TweetDay>
                </Show>

                <ScheduledTweet>
                  <TweetTime>
                    <AiFillClockCircle />
                    {moment(st.publishDate).format("h:mm a").toUpperCase()}
                  </TweetTime>

                  <TweetPreview>
                    <span>
                      {st.thread[0].body.toString().substring(0, 50)}

                      <Show when={st.thread[0].body.toString().length > 50}>
                        ...
                      </Show>
                    </span>

                    <Show when={st.thread.length > 1}>
                      <TweetIsThread>
                        {/* <span>+{st.thread.length - 1} more</span> */}
                        Thread
                      </TweetIsThread>
                    </Show>
                  </TweetPreview>

                  <EditDeleteContainer>
                    <EditIcon onClick={() => handleClickThread(st)}>
                      <FiEdit />
                    </EditIcon>

                    <DeleteIcon onClick={() => handleDelete(st._id)}>
                      <FaRegularTrashCan />
                    </DeleteIcon>
                  </EditDeleteContainer>
                </ScheduledTweet>
              </>
            ))}
          </Show>
        </ScheduleBody>
      </ScheduleContainer>
    </>
  );
}
