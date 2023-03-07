import { styled, css } from "solid-styled-components";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import {
  FaSolidCheck,
  FaSolidCircleXmark,
  FaSolidTrashCan,
} from "solid-icons/fa";
import { AiFillPlusCircle } from "solid-icons/ai";
import { Tooltip } from "@hope-ui/solid";
import { SOLID_APP_API_SERVER, SOLID_APP_MODE } from "../../config";
import { useLead } from "../../stores/leadStore";

export default function Contacts() {
  const [lead, {}] = useLead();

  return (
    <ContactsContainer>
      <ContactsHeader>
        <ContactsHeaderLeft>
          <span>Contacts</span>
          <ContactCount> {lead.contacts.length} </ContactCount>
        </ContactsHeaderLeft>

        <ContactsHeaderRight>
          <span>
            <AiFillPlusCircle />
          </span>
        </ContactsHeaderRight>
      </ContactsHeader>

      <For each={lead.contacts}>
        {(contact) => (
          <ContactContainer>
            <ContactLeft>
              <h1>{contact.name}</h1>
              <span>{contact.title}</span>
            </ContactLeft>
          </ContactContainer>
        )}
      </For>
    </ContactsContainer>
  );
}

// Contacts
const ContactsContainer = styled("div")`
  display: flex;
  flex-direction: column;
`;

const ContactsHeader = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  background-color: #1d9bf0;
  color: #fafafa;
  border-radius: 5px 5px 0 0;
`;

const ContactCount = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  justify-content: center;
  color: #0f1419;
  font-size: 0.7rem;
`;

const ContactsHeaderLeft = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const ContactsHeaderRight = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  color: #e3e3e3;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    color: #0f1419;
  }
`;

const ContactContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  height: 50px;
  font-size: 0.9rem;
  border: 1px solid #ccc;

  &:last-child {
    border-radius: 0 0 5px 5px;
  }
`;

const ContactLeft = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  h1 {
    font-size: 0.9rem;
    font-weight: 500;
  }

  span {
    font-size: 0.7rem;
  }
`;

const ContactRight = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;
