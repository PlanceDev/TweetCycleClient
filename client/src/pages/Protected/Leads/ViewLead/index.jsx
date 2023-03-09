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
import { toast } from "solid-toast";
import { SOLID_APP_API_SERVER, SOLID_APP_MODE } from "../../../../config";
import LeadStatus from "../../../../components/LeadStatus";
import Tasks from "../../../../components/Tasks";
import Contacts from "../../../../components/Contacts";
import Notes from "../../../../components/Notes";

export default function ViewLead() {
  const navigate = useNavigate();
  const [isEditLead, setIsEditLead] = createSignal(false);
  const [lead, { initializeLead, updateLead }] = useLead();
  const [leadDetails, setLeadDetails] = createSignal({
    _id: lead.contacts[0]?._id,
    company: lead.contacts[0]?.company || "",
  });

  const handleChangeLeadDetails = (e) => {
    setLeadDetails({
      ...leadDetails(),
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateLead = () => {
    if (!leadDetails().company) {
      return toast.error("Please enter a company name.");
    }

    let body = {
      company: leadDetails().company,
      type: "company",
    };

    axios
      .put(`${SOLID_APP_API_SERVER}/lead/${lead._id}`, body, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status !== 200) {
          return toast.error("Error updating lead, please try again later.");
        }

        updateLead(res.data.lead);

        toast.success("Lead updated successfully");
        setIsEditLead(false);
      })
      .catch((err) => {
        console.log(err);
      });
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
              <Show when={!isEditLead()}>
                <LeadName>
                  <h1>{lead.company}</h1>
                </LeadName>
              </Show>

              <Show when={isEditLead()}>
                <EditLeadName
                  type="text"
                  placeholder={lead.company || "Company Name"}
                  name="company"
                  value={lead.company}
                  onInput={handleChangeLeadDetails}
                />
              </Show>
            </LeadInfoDiv>

            <LeadInfoDiv>
              <LeadInfoItem>
                <BiSolidContact />
                <span>{lead.contacts[0]?.name}</span>
              </LeadInfoItem>

              <LeadInfoItem>
                <Show when={lead.contacts[0]?.location}>
                  <FaSolidLocationDot />
                  <span>{lead.contacts[0]?.location}</span>
                </Show>
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

              <ActionPill onClick={() => handleUpdateLead()}>
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

const LeadName = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  height: 50px;
  transition: all 0.2s ease-in-out;
`;

const EditLeadName = styled("input")`
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  font-size: 0.9rem;
  width: fit-content;
  height: 50px;

  &:focus {
    border-bottom: 1px solid #000;
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

  font-size: 0.8rem;
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
  /* background-color: aliceblue; */
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
  width: fit-content;

  &:focus {
    border-bottom: 1px solid #000;
  }
`;
