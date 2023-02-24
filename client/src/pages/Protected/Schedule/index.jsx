import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import moment from "moment";
import { FiEdit } from "solid-icons/fi";
import { FaRegularTrashCan } from "solid-icons/fa";
import { AiFillClockCircle } from "solid-icons/ai";
import { AiFillEye } from "solid-icons/ai";
import { RiDocumentDraftLine } from "solid-icons/ri";
import { BsCalendar2CheckFill } from "solid-icons/bs";
import { useSchedule } from "../../../stores/scheduleStore";
import { useTweet } from "../../../stores/tweetStore";
import { useDrawer } from "../../../stores/rightDrawerStore";
import { ActionPill, ActionPillsDiv } from "../../../components/Styles";
import axios from "axios";
import { SOLID_APP_API_SERVER } from "../../../config";
import ScheduleHistory from "../../../components/ScheduleHistory";

export default function Schedule() {
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

      let tweets = res.data.tweets;

      // get US date format
      tweets = tweets.map((tweet) => {
        return { ...tweet, publishDate: new Date(tweet.publishDate) };
      });

      tweets.sort((a, b) => a.publishDate - b.publishDate);

      initializeScheduledTweets(tweets);
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <>
      <ScheduleContainer>
        <ScheduleHistory selectedPage="Scheduled" />

        <ScheduleBody>
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
                      {/* <span>+{st.thread.length - 1} more</span> */}
                      {/* Thread */}
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

const ScheduleContainer = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 15px;
  overflow-y: auto;
`;

const ScheduleHeader = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* border-bottom: 1px solid #ccc; */
  /* padding: 15px; */
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 50px;
`;

const ScheduleBody = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 15px;
  /* padding: 15px; */
  margin-bottom: 10% !important;
`;

const ScheduledTweet = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
  transition: all 0.2s ease-in-out;

  /* &:hover {
    box-shadow: 0 0 5px #ccc;
  } */

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: auto;
    padding: 10px;
    gap: 10px;
  }
`;

const TweetDay = styled("span")`
  font-weight: 600;
  font-size: 1rem;
  /* margin: 10px 0px; */
`;

const TweetTime = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 5px;
  width: 100px;
  padding: 5px;
  background-color: #1da1f2;
  color: white;
  font-weight: bold;
`;

const TweetIsThread = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #1da1f2;
  font-size: 0.8rem;
`;

const TweetPreview = styled("div")`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 5px;
  padding: 5px;
  width: 75%;
  gap: 10px;
`;

const EditDeleteContainer = styled("div")`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const EditIcon = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
  padding: 5px;
  transition: all 0.2s ease-in-out;
  border-radius: 5px;

  cursor: pointer;

  &:hover {
    background-color: #ccc;
  }
`;

const DeleteIcon = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;

  padding: 5px;
  transition: all 0.2s ease-in-out;
  border-radius: 5px;

  cursor: pointer;

  &:hover {
    background-color: #ccc;
  }
`;
