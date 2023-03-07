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

export default function EditTask({ setIsEditTask, task }) {
  const [lead, { updateTask }] = useLead();
  const [newTask, setNewTask] = createSignal({
    lead: task.lead,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    completed: task.completed,
  });

  const handleEditTask = () => {
    if (!newTask().title) return toast.error("Please enter a Title.");
    if (!newTask().dueDate) return toast.error("Please enter a Due Date.");

    setNewTask({ ...newTask(), lead: lead._id, _id: task._id });

    axios
      .put(`${SOLID_APP_API_SERVER}/task/${task._id}`, newTask(), {
        withCredentials: true,
      })
      .then((res) => {
        if (!res.status === 200) return toast.error(res.data.message);

        updateTask(res.data.task);
        setIsEditTask(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  const handleDateChange = (e) => {
    const isoDate = moment(e.target.value, "YYYY-MM-DD").toISOString();

    setNewTask({
      ...newTask(),
      dueDate: new Date(isoDate),
    });
  };

  return (
    <AddTaskContainer>
      <AddTaskHeader>
        <h1>Edit Task</h1>
      </AddTaskHeader>

      <AddTaskInput
        type="text"
        placeholder="Title"
        value={newTask().title}
        onInput={(e) => setNewTask({ ...newTask(), title: e.target.value })}
      />

      <AddTaskInput
        type="text"
        placeholder="Description"
        value={newTask().description}
        onInput={(e) =>
          setNewTask({ ...newTask(), description: e.target.value })
        }
      />

      <AddTaskInput
        type="date"
        placeholder="Due Date"
        min={moment(new Date()).format("YYYY-MM-DD")}
        value={moment(newTask().dueDate).format("YYYY-MM-DD")}
        onInput={handleDateChange}
      />

      <AddTaskFooter>
        <span onClick={() => setIsEditTask(false)}>Cancel</span>
        <AddTaskButton onClick={handleEditTask}>Save</AddTaskButton>
      </AddTaskFooter>
    </AddTaskContainer>
  );
}

const AddTaskContainer = styled("div")`
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

const AddTaskHeader = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1rem;
  margin-bottom: 1rem;
`;

const AddTaskInput = styled("input")`
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

const AddTaskFooter = styled("div")`
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

const AddTaskButton = styled("button")`
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
