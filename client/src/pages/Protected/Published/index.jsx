import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import moment from "moment";
import { useNavigate } from "@solidjs/router";
import { AiFillClockCircle } from "solid-icons/ai";
import { CircularProgress } from "@suid/material";
import { FaRegularEye } from "solid-icons/fa";
import { toast } from "solid-toast";
import { useUser } from "../../../stores/userStore";
import { useSchedule } from "../../../stores/scheduleStore";
import { useTweet } from "../../../stores/tweetStore";
import { usePublished } from "../../../stores/publishedStore";
import { useDrawer } from "../../../stores/rightDrawerStore";
import { Tooltip } from "@hope-ui/solid";
import {
  ScheduleContainer,
  ScheduleBody,
  ScheduledTweet,
  TweetDay,
  TweetTime,
  TweetIsThread,
  TweetPreview,
  EditDeleteContainer,
  EditIcon,
  LoadingContainer,
} from "../../../components/Styles";

import axios from "axios";
import { SOLID_APP_API_SERVER } from "../../../config";
import ScheduleHistory from "../../../components/ScheduleHistory";

export default function Published() {
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(true);
  const [user, { setUser }] = useUser();
  const [rightDrawer, { openRightDrawer, setRightDrawerType }] = useDrawer();
  const [tweet, { initializeTweet }] = useTweet();
  const [publishedTweets, { addPublishedTweets, initializePublishedTweets }] =
    usePublished();

  const [days, setDays] = createSignal([]);

  const handleViewTweet = (tweetId) => {
    let url = `https://twitter.com/${user.twitterUsername}/status/${tweetId}`;
    console.log(url);
    // initializeTweet(pt);
    // setRightDrawerType("view");
    // openRightDrawer();
  };

  createEffect(() => {
    if (publishedTweets.length === 0) return;

    const sortedTweets = [...publishedTweets].sort(
      (a, b) => b.publishDate - a.publishDate
    );

    initializePublishedTweets(sortedTweets);

    const weekDays = sortedTweets.map((tweet) =>
      moment(tweet.publishDate).format("dddd DD MMMM YYYY")
    );

    setDays(weekDays);
  });

  onMount(async () => {
    try {
      const res = await axios.get(`${SOLID_APP_API_SERVER}/tweet/published`, {
        withCredentials: true,
      });

      if (res.status !== 200) {
        return toast.error(
          "Could not retrieve published tweets. Please try again later."
        );
      }

      let publishedTweets = res.data.tweets;

      // get US date format
      publishedTweets = publishedTweets.map((tweet) => {
        return { ...tweet, publishDate: new Date(tweet.publishDate) };
      });

      publishedTweets.sort((a, b) => b.publishDate - a.publishDate);

      initializePublishedTweets(publishedTweets);
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
        <ScheduleHistory selectedPage="Published" />

        <ScheduleBody>
          <Show when={loading()}>
            <LoadingContainer>
              <CircularProgress />
              <p>Loading published tweets...</p>
            </LoadingContainer>
          </Show>

          <Show when={!loading()}>
            <Show when={publishedTweets.length === 0}>
              <p>You don't have any published tweets.</p>
            </Show>

            {publishedTweets.map((pt, i) => (
              <>
                <Show when={days()[i] !== days()[i - 1]}>
                  <TweetDay>
                    {moment(pt.publishDate).format("dddd")} |{" "}
                    {moment(pt.publishDate).format("MMMM DD")}
                  </TweetDay>
                </Show>

                <ScheduledTweet>
                  <TweetTime>
                    <span>
                      <AiFillClockCircle />
                    </span>

                    {moment(pt.publishDate).format("h:mm a").toUpperCase()}
                  </TweetTime>

                  <TweetPreview>
                    <span>
                      {pt.thread[0].body.toString().substring(0, 50)}

                      <Show when={pt.thread[0].body.toString().length > 50}>
                        ...
                      </Show>
                    </span>

                    <Show when={pt.thread.length > 1}>
                      <TweetIsThread>
                        <span>+{pt.thread.length - 1} more</span>
                      </TweetIsThread>
                    </Show>
                  </TweetPreview>

                  <EditDeleteContainer>
                    <Tooltip withArrow label="View Tweet" placement="top-start">
                      <EditIcon
                        onClick={() => handleViewTweet(pt.initialTweetId)}
                      >
                        <FaRegularEye />
                      </EditIcon>
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
