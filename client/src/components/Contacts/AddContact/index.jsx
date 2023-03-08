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

export default function AddContact({ setIsAddContact }) {
  const [lead, { addContact }] = useLead();
  const [newContact, setNewContact] = createSignal({
    lead: lead._id,
    name: "",
    phone: "",
    email: "",
    company: lead.company,
    twitter: "",
    location: "",
  });

  const handleAddContact = () => {
    setNewContact({ ...newContact(), lead: lead._id });

    axios
      .post(`${SOLID_APP_API_SERVER}/contact`, newContact(), {
        withCredentials: true,
      })
      .then((res) => {
        if (!res.status === 200)
          return toast.error("Error adding contact, please try again later.");

        addContact(res.data.contact);
        setIsAddContact(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  return (
    <AddContactContainer>
      <AddContactHeader>
        <h1>Add Contact</h1>
      </AddContactHeader>

      <AddContactInput
        type="text"
        placeholder="Name"
        value={newContact().name}
        onInput={(e) =>
          setNewContact({ ...newContact(), name: e.target.value })
        }
      />

      <AddContactInput
        type="tel"
        placeholder="Phone"
        value={newContact().phone}
        onInput={(e) =>
          setNewContact({ ...newContact(), phone: e.target.value })
        }
      />

      <AddContactInput
        type="text"
        placeholder="Email"
        value={newContact().email}
        onInput={(e) =>
          setNewContact({ ...newContact(), email: e.target.value })
        }
      />

      <AddContactInput
        type="text"
        placeholder="Twitter"
        value={newContact().twitter}
        onInput={(e) =>
          setNewContact({ ...newContact(), twitter: e.target.value })
        }
      />

      <AddContactInput
        type="text"
        placeholder="Location"
        value={newContact().location}
        onInput={(e) =>
          setNewContact({ ...newContact(), location: e.target.value })
        }
      />

      <AddContactFooter>
        <span onClick={() => setIsAddContact(false)}>Cancel</span>
        <AddContactButton onClick={handleAddContact}>
          Add Contact
        </AddContactButton>
      </AddContactFooter>
    </AddContactContainer>
  );
}

const AddContactContainer = styled("div")`
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

const AddContactHeader = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1rem;
  margin-bottom: 1rem;
`;

const AddContactInput = styled("input")`
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

const AddContactFooter = styled("div")`
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

const AddContactButton = styled("button")`
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
