import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { toast } from "solid-toast";

export const TweetContext = createContext([{}, {}]);

export function TweetProvider(props) {
  const [tweet, setTweet] = createStore({});

  const tweetActions = [
    tweet,
    {
      // Initialize the tweet
      initializeTweet(tweet) {
        setTweet(tweet);
      },

      // Update the body of the selected thread
      handleBodyChange(e, id) {
        setTweet("thread", (item) => item.id === id, "body", e.target.value);
      },

      // Handle the change of the publish date
      handlePublishDateChange(date) {
        setTweet("publishDate", date);
      },

      // Upload an image to the tweet
      async handleImageUpload(name, b64, id) {
        setTweet({
          ...tweet,
          thread: tweet.thread.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                attachments: [...item.attachments, { name, b64 }],
              };
            }
            return item;
          }),
        });
      },

      // Remove an image from the tweet
      removeImage(id, index, key) {
        setTweet({
          ...tweet,
          thread: tweet.thread.map((t) => {
            if (t.id === id) {
              console.log(t);

              return {
                ...t,
                attachments: t.attachments.filter((item) => item.key !== key),
              };
            }
            return t;
          }),
        });
      },

      // Add a new tweet to the thread
      addThread() {
        setTweet({
          ...tweet,
          thread: [
            ...tweet.thread,
            {
              id: tweet.thread.length,
              body: "",
              attachments: [],
            },
          ],
        });
      },

      // Remove a tweet from the thread
      removeTweet(id) {
        if (tweet.thread.length === 1 || id === 0) return;

        setTweet((tweet) => ({
          ...tweet,
          thread: tweet.thread
            .filter((item) => item.id !== id)
            .map((item) => {
              if (item.id > id) {
                return { ...item, id: item.id - 1 };
              }
              return item;
            }),
        }));

        // setTweet({
        //   ...tweet,
        //   thread: tweet.thread.filter((item) => item.id !== id),
        // });

        // // Update the id of the tweets after the deleted tweet
        // setTweet({
        //   ...tweet,
        //   thread: tweet.thread.map((item) => {
        //     if (item.id > id) {
        //       return { ...item, id: item.id - 1 };
        //     }

        //     return item;
        //   }),
        // });
      },
    },
  ];

  return (
    <TweetContext.Provider value={tweetActions}>
      {props.children}
    </TweetContext.Provider>
  );
}

export function useTweet() {
  return useContext(TweetContext);
}
