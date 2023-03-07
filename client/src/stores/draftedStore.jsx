import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export const DraftedContext = createContext([]);

export function DraftedProvider(props) {
  const [draftedTweets, setDraftedTweets] = createStore([]);

  const draftedActions = [
    draftedTweets,
    {
      initializeDraftedTweets(draftedTweets) {
        setDraftedTweets(draftedTweets);
      },

      addDraftedTweet(draft) {
        setDraftedTweets([...draftedTweets, draft]);
      },

      removeDraftedTweet(id) {
        setDraftedTweets(draftedTweets.filter((draft) => draft._id !== id));
      },
    },
  ];

  return (
    <DraftedContext.Provider value={draftedActions}>
      {props.children}
    </DraftedContext.Provider>
  );
}

export function useDrafted() {
  return useContext(DraftedContext);
}
