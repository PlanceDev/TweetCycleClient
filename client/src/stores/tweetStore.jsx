import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

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
        setTweet({
          ...tweet,
          thread: tweet.thread.map((item) => {
            if (item.id === id) {
              return { ...item, body: e.target.value };
            }
            return item;
          }),
        });
      },

      // Handle the change of the publish date
      handlePublishDateChange(date) {
        setTweet({
          ...tweet,
          publishDate: date,
        });
      },

      // Upload an image to the tweet
      async handleImageUpload(e, id) {
        const file = e.target.files[0];
        const fileData = await readImageFile(file);
        const base64Image = fileData.split(",")[1];

        setTweet({
          ...tweet,
          thread: tweet.thread.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                attachments: [
                  ...item.attachments,
                  { name: file.name, b64: base64Image },
                ],
              };
            }
            return item;
          }),
        });

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

        setTweet({
          ...tweet,
          thread: tweet.thread.filter((item) => item.id !== id),
        });

        // Update the id of the tweets after the deleted tweet
        setTweet({
          ...tweet,
          thread: tweet.thread.map((item) => {
            if (item.id > id) {
              return { ...item, id: item.id - 1 };
            }

            return item;
          }),
        });
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
