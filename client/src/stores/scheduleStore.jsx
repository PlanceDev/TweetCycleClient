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
        setScheduledTweets([...scheduledTweets, tweet]);
      },

      // Update the scheduled tweet
      editScheduledTweets(id, tweet) {
        setScheduledTweets(
          scheduledTweets.map((item) => {
            if (item.id === id) {
              return tweet;
            }
            return item;
          })
        );
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
