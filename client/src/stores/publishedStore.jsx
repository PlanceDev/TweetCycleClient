import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { toast } from "solid-toast";

export const PublishedContext = createContext([]);

export function PublishedProvider(props) {
  const [publishedTweets, setPublishedTweets] = createStore([]);

  const publishedActions = [
    publishedTweets,
    {
      initializePublishedTweets(tweets) {
        setPublishedTweets(tweets);
      },

      addPublishedTweets(tweet) {
        setPublishedTweets([...publishedTweets, tweet]);
      },
    },
  ];

  return (
    <PublishedContext.Provider value={publishedActions}>
      {props.children}
    </PublishedContext.Provider>
  );
}

export function usePublished() {
  return useContext(PublishedContext);
}
