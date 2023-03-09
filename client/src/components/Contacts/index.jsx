import { styled, css } from "solid-styled-components";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import {
  FaSolidCheck,
  FaSolidCircleXmark,
  FaSolidTrashCan,
} from "solid-icons/fa";
import { FiEdit3 } from "solid-icons/fi";
import { AiFillPlusCircle } from "solid-icons/ai";
import { Tooltip } from "@hope-ui/solid";
import { toast } from "solid-toast";
import axios from "axios";
import { SOLID_APP_API_SERVER, SOLID_APP_MODE } from "../../config";
import { useLead } from "../../stores/leadStore";
import AddContact from "../Contacts/AddContact";
import EditContact from "../Contacts/EditContact";

export default function Contacts() {
  const [lead, { removeContact }] = useLead();
  const [isAddContact, setIsAddContact] = createSignal(false);
  const [isEditContact, setIsEditContact] = createSignal(false);
  const [selectedContact, setSelectedContact] = createSignal(null);

  const handleSelectContact = (id) => {
    setSelectedContact(id);
    setIsEditContact(true);
  };

  const handleRemoveContact = (_id) => {
    axios
      .delete(`${SOLID_APP_API_SERVER}/contact/${_id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status !== 200)
          return toast.error("Error deleting contact, please try again later.");

        removeContact(_id);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <ContactsContainer>
      <ContactsHeader>
        <ContactsHeaderLeft>
          <span>Contacts</span>
          <ContactCount> {lead.contacts.length} </ContactCount>
        </ContactsHeaderLeft>

        <ContactsHeaderRight onClick={() => setIsAddContact(true)}>
          <span>
            <AiFillPlusCircle />
          </span>
        </ContactsHeaderRight>
      </ContactsHeader>

      <Show when={isAddContact()}>
        <AddContact setIsAddContact={setIsAddContact} />
      </Show>

      <For each={lead.contacts}>
        {(contact) => (
          <>
            <Show when={isEditContact() && selectedContact() === contact._id}>
              <EditContact
                setIsEditContact={setIsEditContact}
                contact={contact}
              />
            </Show>
            <ContactContainer>
              <ContactLeft>
                <ContactLeftTop>
                  <h1>{contact.name}</h1>
                  <span>{contact.title}</span>
                </ContactLeftTop>
              </ContactLeft>

              <ContactRight>
                <Tooltip
                  withArrow
                  label="Edit Contact"
                  placement="right"
                  openDelay={500}
                >
                  <ContactAction
                    onclick={() => handleSelectContact(contact._id)}
                  >
                    <FiEdit3 />
                  </ContactAction>
                </Tooltip>

                <Show when={lead.contacts.length > 1}>
                  <Tooltip
                    withArrow
                    label="Delete Contact"
                    placement="right"
                    openDelay={500}
                  >
                    <ContactAction
                      onClick={() => handleRemoveContact(contact._id)}
                    >
                      <FaSolidTrashCan />
                    </ContactAction>
                  </Tooltip>
                </Show>
              </ContactRight>
            </ContactContainer>
          </>
        )}
      </For>
    </ContactsContainer>
  );
}

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
  background-color: #0f1419;
  color: #fafafa;
  border-radius: 5px 5px 0 0;
`;

const ContactCount = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  justify-content: center;
  color: #1d9bf0;
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
  color: #1d9bf0;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    color: #fafafa;
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
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;

  h1 {
    font-size: 0.9rem;
    font-weight: 500;
  }

  span {
    font-size: 0.7rem;
  }
`;

const ContactLeftTop = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  h1 {
    text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
  }
`;

const ContactRight = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 5px;
`;

const ContactAction = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  color: #a3a3a3;
  border-radius: 50%;
  padding: 5px;
  font-size: 0.9rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    color: #505050;
  }
`;
