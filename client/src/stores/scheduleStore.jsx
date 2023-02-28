import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import axios from "axios";
import { toast } from "solid-toast";
import { SOLID_APP_API_SERVER } from "../config";

export const ScheduleContext = createContext([]);

export function ScheduleProvider(props) {
  const [scheduledTweets, setScheduledTweets] = createStore([]);

  const scheduleActions = [
    scheduledTweets,
    {
      // Initialize the scheduled tweets
      initializeScheduledTweets(tweets) {
        setScheduledTweets(tweets);
      },

      // Add a new tweet to the schedule
      addScheduledTweets(tweet) {
        // place tweet in the correct position
        const index = scheduledTweets.findIndex(
          (item) => item.publishDate > tweet.publishDate
        );

        if (index === -1) {
          // if the tweet is the latest, add it to the end

          setScheduledTweets([...scheduledTweets, tweet]);
        } else {
          // if the tweet is not the latest, add it to the correct position

          setScheduledTweets([
            ...scheduledTweets.slice(0, index),
            tweet,
            ...scheduledTweets.slice(index),
          ]);
        }
      },

      // Update the scheduled tweet
      editScheduledTweets(id, tweet) {
        // find the scheduled tweet
        const index = scheduledTweets.findIndex((item) => item._id === id);

        // update the scheduled tweet
        setScheduledTweets([
          ...scheduledTweets.slice(0, index),
          tweet,
          ...scheduledTweets.slice(index + 1),
        ]);
      },

      // Remove a tweet from the schedule
      removeScheduledTweets(id) {
        axios
          .delete(`${SOLID_APP_API_SERVER}/tweet/${id}`, {
            withCredentials: true,
          })
          .then((res) => {
            setScheduledTweets(
              scheduledTweets.filter((item) => item._id !== id)
            );
            toast.success("Tweet removed from schedule!");
          })
          .catch((err) => {
            toast.error("Something went wrong. Please try again.");
          });
      },
    },
  ];

  return (
    <ScheduleContext.Provider value={scheduleActions}>
      {props.children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  return useContext(ScheduleContext);
}
