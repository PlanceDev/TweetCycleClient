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

export default function AddNote({ setIsAddNote }) {
  const [lead, { addNote }] = useLead();
  const [newNote, setNewNote] = createSignal({
    lead: lead._id,
    body: "",
  });

  const handleAddNote = () => {
    axios
      .post(`${SOLID_APP_API_SERVER}/note`, newNote(), {
        withCredentials: true,
      })
      .then((res) => {
        if (!res.status === 200) return toast.error(res.data.message);

        addNote(res.data.note);
        setIsAddNote(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  return (
    <AddNoteContainer>
      <AddNoteHeader>
        <h1>Add Note</h1>
      </AddNoteHeader>

      <AddNoteInput
        type="text"
        placeholder="Note Title"
        value={newNote().body}
        onInput={(e) => setNewNote({ ...newNote(), body: e.target.value })}
      />

      <AddNoteFooter>
        <span onClick={() => setIsAddNote(false)}>Cancel</span>
        <AddNoteButton onClick={handleAddNote}>Add Note</AddNoteButton>
      </AddNoteFooter>
    </AddNoteContainer>
  );
}

const AddNoteContainer = styled("div")`
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

const AddNoteHeader = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1rem;
  margin-bottom: 1rem;
`;

const AddNoteInput = styled("textarea")`
  width: 100%;
  border: 1px solid #ccc;
  height: 100px;
  padding: 0.5rem;
  font-size: 0.8rem;
  transition: all 0.2s ease-in-out;
  resize: none;

  &:focus {
    border: 1px solid #000;
  }
`;

const AddNoteFooter = styled("div")`
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

const AddNoteButton = styled("button")`
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
