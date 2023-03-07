import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export const LeadContext = createContext([{}, {}]);

export function LeadProvider(props) {
  const [lead, setLead] = createStore({
    _id: "",
    company: "",
    contacts: [],
    tasks: [],
    location: "",
    email: "",
    phone: "",
    website: "",
    twitter: "",
    notes: "",
    createdAt: "",
    updatedAt: "",
  });

  const leadActions = [
    lead,
    {
      // Initialize the lead
      initializeLead(lead) {
        setLead(lead);
      },

      // Update the lead
      updateLead(lead) {
        setLead(lead);
      },

      toggleTaskComplete(_id, toggle) {
        setLead("tasks", (task) => task._id === _id, "completed", toggle);
      },

      addTask(task) {
        setLead("tasks", (tasks) => [task, ...tasks]);
      },

      updateTask(task) {
        setLead("tasks", (t) => t._id === task._id, task);
      },

      removeTask(_id) {
        setLead("tasks", (tasks) => tasks.filter((task) => task._id !== _id));
      },
    },
  ];

  return (
    <LeadContext.Provider value={leadActions}>
      {props.children}
    </LeadContext.Provider>
  );
}

export function useLead() {
  return useContext(LeadContext);
}
