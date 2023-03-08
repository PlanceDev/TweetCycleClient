import { styled, css } from "solid-styled-components";
import { createEffect, createSignal, onMount, Show } from "solid-js";
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
import { SOLID_APP_API_SERVER, SOLID_APP_MODE } from "../../config";
import { useLead } from "../../stores/leadStore";
import AddTask from "./AddTask";
import EditTask from "./EditTask";

export default function Tasks() {
  const [lead, { updateTask, toggleTaskComplete, removeTask }] = useLead();
  const [isAddTask, setIsAddTask] = createSignal(false);
  const [isEditTask, setIsEditTask] = createSignal(false);
  const [selectedTask, setSelectedTask] = createSignal(null);

  const handleCompleteTask = (task, toggle) => {
    let newTask = {
      ...task,
      completed: toggle,
    };

    axios
      .put(`${SOLID_APP_API_SERVER}/task/${task._id}`, newTask, {
        withCredentials: true,
      })
      .then((res) => {
        if (!res.status === 200) return toast.error(res.data.message);

        updateTask(res.data.task);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  const handleSelectTask = (id) => {
    setSelectedTask(id);
    setIsEditTask(true);
  };

  const handleRemoveTask = (_id) => {
    axios
      .delete(`${SOLID_APP_API_SERVER}/task/${_id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (!res.status === 200) return toast.error(res.data.message);

        removeTask(_id);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  return (
    <TasksContainer>
      <TasksHeader>
        <TasksHeaderLeft>
          <span>Tasks</span>
          <TaskCount> {lead.tasks.length} </TaskCount>
        </TasksHeaderLeft>

        <TasksHeaderRight>
          <span>
            <AiFillPlusCircle onClick={() => setIsAddTask(true)} />
          </span>
        </TasksHeaderRight>
      </TasksHeader>

      <Show when={isAddTask()}>
        <AddTask setIsAddTask={setIsAddTask} />
      </Show>

      <For each={lead.tasks}>
        {(task) => (
          <>
            <Show when={isEditTask() && selectedTask() === task._id}>
              <EditTask setIsEditTask={setIsEditTask} task={task} />
            </Show>

            <TaskContainer>
              <TaskLeft>
                <TaskLeftTop completed={task.completed}>
                  <h1>{task.title}</h1>
                  <span>{task.description}</span>
                </TaskLeftTop>

                <TaskLeftBottom
                  completed={task.completed}
                  dueDate={task.dueDate}
                >
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </TaskLeftBottom>
              </TaskLeft>

              <TaskRight>
                <TaskRightTop>
                  <Tooltip
                    withArrow
                    label="Edit Task."
                    placement="right"
                    openDelay={500}
                  >
                    <TaskAction onClick={() => handleSelectTask(task._id)}>
                      <FiEdit3 />
                    </TaskAction>
                  </Tooltip>

                  <Show when={!task.completed}>
                    <TaskAction onClick={() => handleCompleteTask(task, true)}>
                      <FaSolidCheck />
                    </TaskAction>
                  </Show>

                  <Show when={task.completed}>
                    <Tooltip
                      withArrow
                      label="Mark task as incomplete."
                      placement="right"
                      openDelay={500}
                    >
                      <TaskAction
                        onClick={() => handleCompleteTask(task, false)}
                      >
                        <FaSolidCircleXmark />
                      </TaskAction>
                    </Tooltip>
                  </Show>

                  <Tooltip
                    withArrow
                    label="Delete Task."
                    placement="right"
                    openDelay={500}
                  >
                    <TaskAction onClick={() => handleRemoveTask(task._id)}>
                      <FaSolidTrashCan />
                    </TaskAction>
                  </Tooltip>
                </TaskRightTop>

                <TaskRightBottom completed={task.completed}>
                  <span>{task.completed ? "Complete" : "Incomplete"}</span>
                </TaskRightBottom>
              </TaskRight>
            </TaskContainer>
          </>
        )}
      </For>
    </TasksContainer>
  );
}

// Tasks
const TasksContainer = styled("div")`
  display: flex;
  flex-direction: column;
`;

const TasksHeader = styled("div")`
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

const TaskCount = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d9bf0;
  font-size: 0.7rem;
`;

const TasksHeaderLeft = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const TasksHeaderRight = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  color: #1d9bf0;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #fafafa;
  }
`;

const TaskContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-top: none;

  &:last-child {
    border-radius: 0 0 5px 5px;
  }
`;

const TaskLeft = styled("div")`
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

const TaskLeftTop = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  h1 {
    text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
  }
`;

const TaskLeftBottom = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  span {
    color: ${(props) =>
      new Date(props.dueDate).getTime() - new Date().getTime() < 86400000 &&
      !props.completed
        ? "#fa9078"
        : "#a3a3a3"};
  }
`;

const TaskRight = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;
  height: 100%;

  span {
    font-size: 0.7rem;
  }
`;

const TaskRightTop = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 10px;
`;

const TaskAction = styled("div")`
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
`;

const TaskRightBottom = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  span {
    color: ${(props) => (props.completed ? "#40d397" : "#fa9078")};
  }
`;
