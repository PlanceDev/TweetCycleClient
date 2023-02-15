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

const tweets = [
  {
    publishDate: new Date("February 10, 2023 12:24:00"),
    id: 1,
    thread: [
      {
        id: 1,
        body: "New Year's Day is the first day of the year, or January 1, in the Gregorian calendar.",
        attachments: [],
      },
      {
        id: 2,
        body: "New Year's Day is the first day of the year, or January 1, in the Gregorian calendar.",
        attachments: [],
      },
    ],
  },
  {
    publishDate: new Date("February 11, 2023 03:24:00"),
    id: 2,
    thread: [
      {
        id: 1,
        body: "New Year'sof the year, or January 1, in the Gregorian calendar.",
        attachments: [],
      },
    ],
  },
  {
    publishDate: new Date("February 11, 2023 05:24:00"),
    id: 3,
    thread: [
      {
        id: 1,
        body: "New Year's Day is the first day o.",
        attachments: [],
      },
    ],
  },
  {
    publishDate: new Date("February 18, 2023 03:24:00"),
    id: 4,
    thread: [
      {
        id: 1,
        body: "The 18th",
        attachments: [],
      },
    ],
  },
];

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

    let weekDays = [];
    let sortedTweets = [...scheduledTweets];

    sortedTweets.sort((a, b) => {
      return a.publishDate - b.publishDate;
    });

    initializeScheduledTweets(sortedTweets);

    scheduledTweets.forEach((tweet) => {
      weekDays.push(moment(tweet.publishDate).format("dddd DD MMMM YYYY"));
    });

    setDays(weekDays);
  });

  onMount(() => {
    tweets.sort((a, b) => {
      return a.publishDate - b.publishDate;
    });

    initializeScheduledTweets(tweets);
  });

  return (
    <>
      <ScheduleContainer>
        <ScheduleHeader>
          <span>Scheduled Tweets</span>

          <ActionPillsDiv>
            <ActionPill>
              <RiDocumentDraftLine /> Drafts
            </ActionPill>
            <ActionPill>
              <BsCalendar2CheckFill /> Published
            </ActionPill>
          </ActionPillsDiv>
        </ScheduleHeader>

        <ScheduleBody>
          <Show when={scheduledTweets.length === 0}>
            <p>You haven't scheduled any tweets.</p>
          </Show>

          {scheduledTweets.map((st, i) => (
            <>
              {/* <div> */}
              <Show when={days()[i] !== days()[i - 1]}>
                <TweetDay>
                  {/* <span
                      style={{
                        "background-color": "#fff",
                        "border-radius": "0",
                        border: "1px solid #ccc",
                        "border-bottom": "none",
                        padding: "5px",
                      }}
                    > */}
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
                  {/* </span> */}
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
                      Thread
                    </TweetIsThread>
                  </Show>
                </TweetPreview>

                <EditDeleteContainer>
                  <EditIcon onClick={() => handleClickThread(st)}>
                    <FiEdit />
                  </EditIcon>

                  <DeleteIcon onClick={() => handleDelete(st.id)}>
                    <FaRegularTrashCan />
                  </DeleteIcon>
                </EditDeleteContainer>
              </ScheduledTweet>
              {/* </div> */}
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