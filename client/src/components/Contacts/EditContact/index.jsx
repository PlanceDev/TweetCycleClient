import { styled, css } from "solid-styled-components";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import moment from "moment";
import {
  FaSolidCheck,
  FaSolidCircleXmark,
  FaSolidTrashCan,
} from "solid-icons/fa";
import { AiFillPlusCircle } from "solid-icons/ai";
import { Tooltip } from "@hope-ui/solid";
import { toast } from "solid-toast";
import axios from "axios";
import { SOLID_APP_API_SERVER, SOLID_APP_MODE } from "../../../config";
import { useLead } from "../../../stores/leadStore";

export default function EditContact({ setIsEditContact, contact }) {
  const [lead, { editContact }] = useLead();
  const [newContact, setNewContact] = createSignal({
    lead: lead._id,
    company: lead.company,
    name: contact.name,
    title: contact.title,
    email: contact.email,
    phone: contact.phone,
    twitter: contact.twitter,
    url: contact.url,
    location: contact.location,
  });

  const handleEditContact = () => {
    setNewContact({ ...newContact(), lead: lead._id });

    axios
      .put(`${SOLID_APP_API_SERVER}/contact/${contact._id}`, newContact(), {
        withCredentials: true,
      })
      .then((res) => {
        if (!res.status === 200)
          return toast.error("Error updating contact, please try again later.");

        editContact(res.data.contact);
        setIsEditContact(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  return (
    <EditContactContainer>
      <EditContactHeader>
        <h1>Edit Contact</h1>
      </EditContactHeader>

      <EditContactInput
        type="text"
        placeholder="Name"
        value={newContact().name}
        onInput={(e) =>
          setNewContact({ ...newContact(), name: e.target.value })
        }
      />

      <EditContactInput
        type="text"
        placeholder="Title"
        value={newContact().title}
        onInput={(e) =>
          setNewContact({ ...newContact(), title: e.target.value })
        }
      />

      <EditContactInput
        type="tel"
        placeholder="Phone"
        value={newContact().phone}
        onInput={(e) =>
          setNewContact({ ...newContact(), phone: e.target.value })
        }
      />

      <EditContactInput
        type="text"
        placeholder="Email"
        value={newContact().email}
        onInput={(e) =>
          setNewContact({ ...newContact(), email: e.target.value })
        }
      />

      <EditContactInput
        type="text"
        placeholder="Twitter"
        value={newContact().twitter}
        onInput={(e) =>
          setNewContact({ ...newContact(), twitter: e.target.value })
        }
      />

      <EditContactInput
        type="text"
        placeholder="URL"
        value={newContact().url}
        onInput={(e) => setNewContact({ ...newContact(), url: e.target.value })}
      />

      <EditContactInput
        type="text"
        placeholder="Location"
        value={newContact().location}
        onInput={(e) =>
          setNewContact({ ...newContact(), location: e.target.value })
        }
      />

      <EditContactFooter>
        <span onClick={() => setIsEditContact(false)}>Cancel</span>
        <EditContactButton onClick={handleEditContact}>Save</EditContactButton>
      </EditContactFooter>
    </EditContactContainer>
  );
}

const EditContactContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 1rem;
  border: 1px solid #ccc;
  z-index: 100;
  gap: 10px;
  animation: slideIn 0.3s ease-in-out;
  animation-fill-mode: forwards;

  @keyframes slideIn {
    0% {
      transform: translateY(-20%);
    }
    100% {
      transform: translateY(0);
    }
  }
`;

const EditContactHeader = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1rem;
  margin-bottom: 1rem;
`;

const EditContactInput = styled("input")`
  width: 100%;
  height: 2rem;
  border: 1px solid #ccc;
  padding: 0.5rem;
  font-size: 0.8rem;
  transition: all 0.2s ease-in-out;

  &:focus {
    border: 1px solid #000;
  }
`;

const EditContactFooter = styled("div")`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  align-items: center;
  width: 100%;
  height: 2rem;
  margin-top: 1rem;

  span {
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
      color: #1d9bf0;
    }
  }
`;

const EditContactButton = styled("button")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  background-color: #1d9bf0;
  color: #fff;
  border-radius: 2px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #1a91da;
    color: #fff;
  }
`;
