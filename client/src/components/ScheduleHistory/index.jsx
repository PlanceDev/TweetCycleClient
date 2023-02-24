import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import moment from "moment";
import axios from "axios";
import { SOLID_APP_API_SERVER } from "../../config";
import { FiEdit } from "solid-icons/fi";
import { FaRegularTrashCan } from "solid-icons/fa";
import { AiFillClockCircle } from "solid-icons/ai";
import { AiFillEye } from "solid-icons/ai";
import { RiDocumentDraftLine } from "solid-icons/ri";
import { BsCalendar2CheckFill } from "solid-icons/bs";
import {
  ActionPill,
  ActionPillsDiv,
  ScheduleContainer,
  ScheduleBody,
  ScheduleHeader,
  ScheduledTweet,
  TweetDay,
  TweetTime,
  TweetIsThread,
  TweetPreview,
  EditDeleteContainer,
  EditIcon,
  DeleteIcon,
} from "../Styles";

export default function ScheduleHistory({ selectedPage = "Scheduled" }) {
  const navigate = useNavigate();

  return (
    <>
      <ScheduleHeader>
        <span>{selectedPage} Tweets</span>

        <ActionPillsDiv>
          <ActionPill onClick={() => navigate("/a/schedule")}>
            <AiFillClockCircle />
            Scheduled
          </ActionPill>

          <ActionPill onClick={() => navigate("/a/published")}>
            <BsCalendar2CheckFill />
            Published
          </ActionPill>

          <ActionPill onClick={() => navigate("/a/drafts")}>
            <RiDocumentDraftLine /> Drafts
          </ActionPill>
        </ActionPillsDiv>
      </ScheduleHeader>
    </>
  );
}
