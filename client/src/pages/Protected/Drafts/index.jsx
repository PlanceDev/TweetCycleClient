import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import moment from "moment";
import { FiEdit } from "solid-icons/fi";
import { FaRegularTrashCan } from "solid-icons/fa";
import { AiFillClockCircle } from "solid-icons/ai";
import { AiFillEye } from "solid-icons/ai";
import { toast } from "solid-toast";
import { useSchedule } from "../../../stores/scheduleStore";
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
} from "../../../components/Styles";

import axios from "axios";
import { SOLID_APP_API_SERVER } from "../../../config";
import ScheduleHistory from "../../../components/ScheduleHistory";

export default function Drafts() {
  const [rightDrawer, { openRightDrawer, setRightDrawerType }] = useDrawer();
  const [tweet, { initializeTweet }] = useTweet();
  const [
    scheduledTweets,
    { removeScheduledTweets, initializeScheduledTweets },
  ] = useSchedule();

  const [days, setDays] = createSignal([]);

  const handleDelete = (id) => {
    removeScheduledTweets(id);
  };

  const handleClickThread = (st) => {
    initializeTweet(st);
    setRightDrawerType("edit");
    openRightDrawer();
  };

  createEffect(() => {
    if (scheduledTweets.length === 0) return;

    let weekDays = [];
    let sortedTweets = [...scheduledTweets];

    sortedTweets.sort((a, b) => {
      return a.publishDate - b.publishDate;
    });

    initializeScheduledTweets(sortedTweets);

    scheduledTweets.forEach((tweet) => {
      weekDays.push(moment(tweet.publishDate).format("dddd DD MMMM YYYY"));
    });

    setDays(weekDays);
  });

  onMount(() => {
    axios
      .get(`${SOLID_APP_API_SERVER}/tweet/drafts`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status !== 200) {
          return toast.error(
            "Could not retrieve drats. Please try again later."
          );
        }

        let tweets = res.data.tweets;

        // get US date format
        tweets.forEach((tweet) => {
          tweet.publishDate = new Date(tweet.publishDate);
        });

        tweets.sort((a, b) => {
          return a.publishDate - b.publishDate;
        });

        initializeScheduledTweets(tweets);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <>
      <ScheduleContainer>
        <ScheduleHistory selectedPage="Draft" />

        <ScheduleBody>
          <Show when={scheduledTweets.length === 0}>
            <p>You don't have any drafts.</p>
          </Show>

          {scheduledTweets.map((st, i) => (
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
        </ScheduleBody>
      </ScheduleContainer>
    </>
  );
}
