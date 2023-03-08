import { styled } from "solid-styled-components";

export const ActionPill = styled("button")`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  color: #aaa;
  background-color: transparent;
  border: 1px solid #a3a3a3;
  padding: 5px 15px;
  font-weight: 500;
  font-size: 0.8rem;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #eee;
  }

  &:focus {
    outline: none;
  }

  svg {
    height: 15px;
    width: 15px;
    color: #a3a3a3 !important;
  }
`;

export const ActionPillsDiv = styled("div")`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export const WriteTweetButton = styled("button")`
  display: flex;
  height: 40px;
  font-size: 0.9rem;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 2px;
  border: none;
  background-color: #1da1f2;
  color: #fff;
  padding: 10px;
  /* margin-left: 10px; */
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #1a91da;
  }

  &:focus {
    outline: none;
  }

  @media screen and (min-width: 768px) {
    display: flex;
  }
`;

// Schedule Styles

export const ScheduleContainer = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 15px;
  overflow-y: auto;
  font-family: "Poppins", sans-serif;
`;

export const ScheduleHeader = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* border-bottom: 1px solid #ccc; */
  /* padding: 15px; */
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 50px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: auto;
    padding: 10px;
    gap: 10px;
  }
`;

export const ScheduleBody = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 15px;
  /* padding: 15px; */
  margin-bottom: 10% !important;
`;

export const ScheduledTweet = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 20px;
  border-radius: 3px;
  border: 1px solid #ccc;
  transition: all 0.2s ease-in-out;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: auto;
    padding: 10px;
    gap: 10px;
  }
`;

export const TweetDay = styled("span")`
  font-weight: 600;
  font-size: 1.2rem;
`;

export const TweetTime = styled("div")`
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

export const TweetIsThread = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #1da1f2;
  font-size: 0.8rem;
`;

export const TweetPreview = styled("div")`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 5px;
  padding: 5px;
  width: 75%;
  gap: 10px;
`;

export const EditDeleteContainer = styled("div")`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const EditIcon = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  padding: 5px;
  transition: all 0.2s ease-in-out;
  border-radius: 5px;
  color: #a3a3a3;

  cursor: pointer;

  &:hover {
    color: #000;
  }
`;

export const DeleteIcon = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  cursor: pointer;
  color: #a3a3a3;

  padding: 5px;
  transition: all 0.2s ease-in-out;
  border-radius: 5px;

  &:hover {
    color: #000;
  }
`;

export const LoadingContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 5px;
  margin-top: 30px;
`;
