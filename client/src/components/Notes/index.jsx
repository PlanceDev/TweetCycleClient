import { styled, css } from "solid-styled-components";
import { useNavigate, A, useLocation } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show, Suspense } from "solid-js";
import axios from "axios";
import {
  FaSolidCheck,
  FaSolidCircleXmark,
  FaSolidTrashCan,
} from "solid-icons/fa";
import { AiFillPlusCircle } from "solid-icons/ai";
import { FiEdit3 } from "solid-icons/fi";
import { Tooltip } from "@hope-ui/solid";
import { toast } from "solid-toast";
import moment from "moment";
import { SOLID_APP_API_SERVER, SOLID_APP_MODE } from "../../config";
import { useLead } from "../../stores/leadStore";
import AddNote from "./AddNote";
import EditNote from "./EditNote";

export default function Notes() {
  const [lead, { updateLead, removeNote }] = useLead();
  const [isAddNote, setIsAddNote] = createSignal(false);
  const [isEditNote, setIsEditNote] = createSignal(false);
  const [selectedNote, setSelectedNote] = createSignal(null);

  const handleSelectNote = (id) => {
    setIsEditNote(true);
    setSelectedNote(id);
  };

  const handleDeleteNote = (id) => {
    axios
      .delete(`${SOLID_APP_API_SERVER}/note/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (!res.status === 200) return toast.error(res.data.message);

        removeNote(id);
        toast.success("Note deleted successfully.");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <NotesContainer>
      <NotesHeader>
        <NotesHeaderLeft>
          <h1>Notes</h1>
        </NotesHeaderLeft>

        <NotesHeaderRight>
          <AiFillPlusCircle
            onClick={() => setIsAddNote(true)}
            style={{ cursor: "pointer" }}
          />
        </NotesHeaderRight>
      </NotesHeader>

      <Show when={isAddNote()}>
        <AddNote setIsAddNote={setIsAddNote} />
      </Show>

      <For each={lead.notes}>
        {(note) => (
          <>
            <Show when={isEditNote() && selectedNote() === note._id}>
              <EditNote setIsEditNote={setIsEditNote} note={note} />
            </Show>

            <NoteContainer>
              <NoteContainerBody>{note.body}</NoteContainerBody>

              <NoteContainerFooter>
                <NoteContainerFooterLeft>
                  <div>
                    <span>created on</span>{" "}
                    {moment(note.createdAt).format("MMM Do, YYYY")}
                  </div>
                </NoteContainerFooterLeft>

                <NoteContainerFooterRight>
                  <Tooltip label="Edit Note" placement="left" openDelay={500}>
                    <NoteAction onClick={() => handleSelectNote(note._id)}>
                      <FiEdit3 />
                    </NoteAction>
                  </Tooltip>

                  <Tooltip label="Delete Note" placement="left" openDelay={500}>
                    <NoteAction onClick={() => handleDeleteNote(note._id)}>
                      <FaSolidTrashCan />
                    </NoteAction>
                  </Tooltip>
                </NoteContainerFooterRight>
              </NoteContainerFooter>
            </NoteContainer>
          </>
        )}
      </For>
    </NotesContainer>
  );
}

const NotesContainer = styled("div")`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const NotesHeader = styled("div")`
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

const NotesHeaderLeft = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const NotesHeaderRight = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  color: #1d9bf0;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #fafafa;
  }
`;

const NoteContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  font-size: 0.8rem;
  border: 1px solid #ccc;
  border-top: none;

  &:last-child {
    border-radius: 0 0 5px 5px;
  }
`;

const NoteContainerBody = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  font-weight: 400;
`;

const NoteContainerFooter = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  min-height: 30px;
`;

const NoteContainerFooterLeft = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  font-size: 0.7rem;
  height: 100%;

  span {
    color: #7a7a7a;
  }
`;

const NoteContainerFooterRight = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #a3a3a3;
`;

const NoteAction = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  color: #a3a3a3;
  font-size: 0.9rem;
  border-radius: 50%;
  padding: 5px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    color: #505050;
  }

  &:focus {
    outline: none !important;
    border: none !important;
  }
`;
