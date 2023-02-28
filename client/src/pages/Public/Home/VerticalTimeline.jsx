import { styled } from "solid-styled-components";
import { createSignal } from "solid-js";
import { AiFillCheckCircle } from "solid-icons/ai";

const VerticalTimelineWrapper = styled("div")`
  display: flex;
  /* flex: 50%; */
  flex-direction: column;
  margin: 0 auto;
`;

const TimelineItemWrapper = styled("div")`
  display: flex;
  flex-direction: row;
  position: relative;
  padding-bottom: 25px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 25px;
    width: 2px;
    height: 100%;
    background-color: #ccc;
  }

  &:last-child {
    padding-bottom: 0;
  }
`;

const TimelineContentWrapper = styled("div")`
  margin-left: 35px;
`;

const TimelineTitle = styled("h3")`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
  margin-left: 20px;
`;

const TimelineDescription = styled("p")`
  font-size: 1rem;
  margin: 0;
  margin-left: 20px;
`;

export default function VerticalTimeline() {
  const [items, setItems] = createSignal([
    {
      title: "Schedule Tweets",
      description:
        "Plan and create your tweets ahead of time and schedule them to be posted at a later date and time for maximum engagement and reach.",
    },
    {
      title: "AI Generated Tweets",
      description:
        "Use our tool's cutting-edge AI technology to automatically generate tweets tailored to your audience, saving you time and effort.",
    },
    {
      title: "AI Generated Growth Hacks",
      description:
        "Get personalized growth recommendations, such as the best Twitter accounts to follow and optimal posting times, to help you grow your Twitter following.",
    },
    {
      title: "Contact & Lead Management",
      description:
        "Manage your contacts and leads on Twitter with features like lead generation, contact management, and customer service support.",
    },
  ]);

  return (
    <VerticalTimelineWrapper>
      {items().map((item, index) => (
        <TimelineItemWrapper key={index}>
          <div
            style={{
              display: "flex",
              "align-items": "center",
              "justify-content": "center",
              width: "50px",
              height: "50px",
              top: "20px",
              position: "absolute",
            }}
          >
            <AiFillCheckCircle size="30" color="#1D9BF0" />
          </div>
          <TimelineContentWrapper>
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineDescription>{item.description}</TimelineDescription>
          </TimelineContentWrapper>
        </TimelineItemWrapper>
      ))}
    </VerticalTimelineWrapper>
  );
}
