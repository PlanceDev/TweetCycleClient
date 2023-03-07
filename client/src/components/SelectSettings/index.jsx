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
import { ActionPill, ActionPillsDiv, ScheduleHeader } from "../Styles";

export default function SelectSettings({ selectedPage = "General" }) {
  const navigate = useNavigate();

  return (
    <>
      <ScheduleHeader>
        <span>Account - {selectedPage}</span>

        <ActionPillsDiv>
          <ActionPill onClick={() => navigate("/a/account")}>
            <AiFillClockCircle />
            General
          </ActionPill>

          <ActionPill onClick={() => navigate("/a/account/billing")}>
            <BsCalendar2CheckFill />
            Billing
          </ActionPill>
        </ActionPillsDiv>
      </ScheduleHeader>
    </>
  );
}
