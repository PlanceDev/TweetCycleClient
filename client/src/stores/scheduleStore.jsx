import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

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

      // Remove a tweet from the schedule
      removeScheduledTweets(id) {
        setScheduledTweets(scheduledTweets.filter((item) => item.id !== id));
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
