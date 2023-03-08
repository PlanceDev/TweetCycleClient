import { styled, css } from "solid-styled-components";
import { useNavigate, A, useLocation } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show, Suspense } from "solid-js";

import { AiFillEdit } from "solid-icons/ai";
import { FaSolidLocationDot } from "solid-icons/fa";
import { BiSolidContact } from "solid-icons/bi";
import { AiFillPhone } from "solid-icons/ai";
import { AiFillMail } from "solid-icons/ai";
import { AiFillPlusCircle } from "solid-icons/ai";
import { FaSolidCheck } from "solid-icons/fa";
import { FaSolidCircleXmark } from "solid-icons/fa";
import { FaSolidTrashCan } from "solid-icons/fa";
import { BsGlobe } from "solid-icons/bs";
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
import Notes from "../../../../components/Notes";

export default function ViewLead() {
  const navigate = useNavigate();
  const [isEditLead, setIsEditLead] = createSignal(false);
  const [lead, { initializeLead }] = useLead();
  const [leadDetails, setLeadDetails] = createSignal({
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    location: lead.location,
  });

  const handleChangeLeadDetails = (e) => {
    setLeadDetails({
      ...leadDetails(),
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateLead = () => {
    console.log(leadDetails());
  };

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
              <LeadInfoItem>
                <BiSolidContact />
                <span>{lead.contacts[0]?.name}</span>
              </LeadInfoItem>

              <LeadInfoItem>
                <FaSolidLocationDot />

                <span>Los Angeles, CA</span>
              </LeadInfoItem>

              <LeadInfoItem>
                <Show when={!isEditLead()}>
                  <AiFillMail />
                  <span>pythonkoder@gmail.com</span>
                </Show>

                <Show when={isEditLead()}>
                  <AiFillMail />
                  <EditInput type="text" placeholder={lead.email} />
                </Show>
              </LeadInfoItem>

              <LeadInfoItem>
                <AiFillPhone />
                <span>832-609-7262</span>
              </LeadInfoItem>
            </LeadInfoDiv>
          </LeadInfoContainer>

          <ActionPillsDiv>
            <Show when={!isEditLead()}>
              <ActionPill onClick={() => setIsEditLead(true)}>
                <AiFillEdit />
                Edit Lead
              </ActionPill>
            </Show>

            <Show when={isEditLead()}>
              <ActionPill onClick={() => setIsEditLead(false)}>
                Cancel
              </ActionPill>

              <ActionPill onClick={() => setIsEditLead(false)}>
                <FaSolidCheck />
                Save
              </ActionPill>
            </Show>
          </ActionPillsDiv>
        </LeadHeader>

        <LeadBody>
          <LeadBodyLeft>
            <LeadStatus />
            <Tasks />
            <Contacts />
          </LeadBodyLeft>

          <LeadBodyRight>
            <Notes />
          </LeadBodyRight>
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
    font-weight: bold;
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
  gap: 20px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: auto;
    padding: 10px;
    gap: 10px;
  }
`;

const LeadInfoItem = styled("div")`
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
  height: fit-content;
`;

const LeadBodyRight = styled("div")`
  display: flex;
  flex: 60%;
  flex-direction: column;
  gap: 15px;
  height: fit-content;
  /* background-color: #ccc; */
`;

const EditInput = styled("input")`
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  font-size: 0.9rem;

  &:focus {
    border-bottom: 1px solid #000;
  }
`;
