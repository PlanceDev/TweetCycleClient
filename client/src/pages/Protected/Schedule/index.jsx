import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import moment from "moment";
import axios from "axios";
import { Tooltip } from "@hope-ui/solid";
import { FiEdit } from "solid-icons/fi";
import { FaRegularTrashCan } from "solid-icons/fa";
import { AiFillClockCircle } from "solid-icons/ai";
import { CircularProgress } from "@suid/material";
import { toast } from "solid-toast";
import { useSchedule } from "../../../stores/scheduleStore";
import { useTweet } from "../../../stores/tweetStore";
import { useDrawer } from "../../../stores/rightDrawerStore";
import { SOLID_APP_API_SERVER } from "../../../config";
import ScheduleHistory from "../../../components/ScheduleHistory";
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

export default function Schedule() {
  const [loading, setLoading] = createSignal(true);
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

    const sortedTweets = [...scheduledTweets].sort(
      (a, b) => a.publishDate - b.publishDate
    );

    initializeScheduledTweets(sortedTweets);

    const weekDays = sortedTweets.map((tweet) =>
      moment(tweet.publishDate).format("dddd DD MMMM YYYY")
    );

    setDays(weekDays);
  });

  onMount(async () => {
    try {
      const res = await axios.get(`${SOLID_APP_API_SERVER}/tweet/scheduled`, {
        withCredentials: true,
      });

      if (res.status !== 200) {
        return toast.error("Error getting scheduled tweets");
      }

      let tweets = res.data.tweets;

      // get US date format
      tweets = tweets.map((tweet) => {
        return { ...tweet, publishDate: new Date(tweet.publishDate) };
      });

      tweets.sort((a, b) => a.publishDate - b.publishDate);

      initializeScheduledTweets(tweets);
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
        <ScheduleHistory selectedPage="Scheduled" />

        <ScheduleBody>
          <Show when={loading()}>
            <LoadingContainer>
              <CircularProgress />
              <p>Loading scheduled tweets...</p>
            </LoadingContainer>
          </Show>

          <Show when={!loading()}>
            <Show when={scheduledTweets.length === 0}>
              <p>You don't have any scheduled tweets.</p>
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
                        <span>+{st.thread.length - 1} more</span>
                        {/* Thread */}
                      </TweetIsThread>
                    </Show>
                  </TweetPreview>

                  <EditDeleteContainer>
                    <Tooltip withArrow label="Edit tweet">
                      <EditIcon onClick={() => handleClickThread(st)}>
                        <FiEdit />
                      </EditIcon>
                    </Tooltip>

                    <Tooltip withArrow label="Delete tweet">
                      <DeleteIcon onClick={() => handleDelete(st._id)}>
                        <FaRegularTrashCan />
                      </DeleteIcon>
                    </Tooltip>
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
