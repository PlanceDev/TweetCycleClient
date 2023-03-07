import { styled, css } from "solid-styled-components";
import { useNavigate, A, useLocation } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show, Suspense } from "solid-js";

import { AiFillEdit } from "solid-icons/ai";
import { FaSolidLocationDot } from "solid-icons/fa";
import { BiSolidContact } from "solid-icons/bi";
import { AiFillPlusCircle } from "solid-icons/ai";
import { FaSolidCheck } from "solid-icons/fa";
import { FaSolidCircleXmark } from "solid-icons/fa";
import { FaSolidTrashCan } from "solid-icons/fa";
import { Tooltip } from "@hope-ui/solid";
import {
  ActionPill,
  ScheduleHeader,
  ActionPillsDiv,
} from "../../../../components/Styles";

import axios from "axios";
import { useLead } from "../../../../stores/leadStore";
import { SOLID_APP_API_SERVER, SOLID_APP_MODE } from "../../../../config";
import LeadStatus from "../../../../components/LeadStatus";
import Tasks from "../../../../components/Tasks";
import Contacts from "../../../../components/Contacts";

// const testLead = {
//   _id: 1,
//   company: "Microsoft",
//   contacts: [
//     {
//       name: "John Doe",
//       email: "",
//       phone: "",
//       notes: "",
//       title: "CEO",
//     },
//     {
//       name: "Jane Doe",
//       email: "",
//       phone: "",
//       notes: "",
//       title: "CTO",
//     },
//   ],
//   tasks: [
//     {
//       _id: 1,
//       title: "Send follow up email",
//       description: "Send follow up email to John Doe",
//       dueDate: "3/5/2023",
//       completed: true,
//     },
//   ],
//   location: "Atlanta, GA",
//   status: "New",
//   email: "",
//   phone: "",
//   website: "",
//   twitter: "",
//   notes: "",
//   createdAt: "2021-08-01T00:00:00.000Z",
//   updatedAt: "2021-08-01T00:00:00.000Z",
// };

export default function ViewLead() {
  const navigate = useNavigate();
  const [isEditLead, setIsEditLead] = createSignal(false);
  const [lead, { initializeLead, updateLead, updateTask, toggleTaskComplete }] =
    useLead();

  onMount(() => {
    let path = useLocation().pathname.split("/");
    const leadId = path[path.length - 1];

    axios
      .get(`${SOLID_APP_API_SERVER}/lead/${leadId}`, {
        withCredentials: true,
      })
      .then((res) => {
        initializeLead(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <>
      <ViewLeadContainer>
        <LeadHeader>
          <LeadInfoContainer>
            <LeadInfoDiv>
              <h1>{lead.company}</h1>
            </LeadInfoDiv>

            <LeadInfoDiv>
              <BiSolidContact />
              <span>{lead.contacts[0]?.name}</span>
            </LeadInfoDiv>

            <LeadInfoDiv>
              <FaSolidLocationDot />
              <Show when={lead.location}>
                <span>{lead.location}</span>
              </Show>

              <Show when={!lead.location}>
                <span>Add Location</span>
              </Show>
            </LeadInfoDiv>
          </LeadInfoContainer>

          <ActionPillsDiv>
            <ActionPill onClick={() => setIsEditLead(true)}>
              <AiFillPlusCircle />
              Note
            </ActionPill>

            <ActionPill onClick={() => setIsEditLead(true)}>
              <AiFillEdit />
              Delete
            </ActionPill>
          </ActionPillsDiv>
        </LeadHeader>

        <LeadBody>
          <LeadBodyLeft>
            <LeadStatus />
            <Tasks />
            <Contacts />
          </LeadBodyLeft>

          <LeadBodyRight></LeadBodyRight>
        </LeadBody>
      </ViewLeadContainer>
    </>
  );
}

const ViewLeadContainer = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 15px;
  overflow-y: auto;
`;

export const LeadHeader = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 50px;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  span {
    font-size: 0.9rem;
    font-weight: 400;
    margin: 0;
    color: #a3a3a3 !important;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: auto;
    padding: 10px;
    gap: 10px;
  }
`;

const LeadInfoContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;

  svg {
    color: #a3a3a3 !important;
  }
`;

const LeadInfoDiv = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const LeadBody = styled("div")`
  display: flex;
  flex-direction: row;
  height: 100%;
  gap: 15px;
  /* padding: 15px; */
  margin-bottom: 10% !important;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeadBodyLeft = styled("div")`
  display: flex;
  flex: 40%;
  flex-direction: column;
  gap: 15px;
  /* background-color: aliceblue; */
`;

const LeadBodyRight = styled("div")`
  display: flex;
  flex: 60%;
  flex-direction: column;
  gap: 15px;
  background-color: #ccc;
`;
