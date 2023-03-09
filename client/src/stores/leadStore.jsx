import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export const LeadContext = createContext([{}, {}]);

export function LeadProvider(props) {
  const [lead, setLead] = createStore({
    _id: "",
    company: "",
    contacts: [],
    tasks: [],
    notes: "",
    createdAt: "",
    updatedAt: "",
  });

  const leadActions = [
    lead,
    {
      // Lead
      initializeLead(lead) {
        setLead(lead);
      },

      updateLead(lead) {
        setLead(lead);
      },

      toggleTaskComplete(_id, toggle) {
        setLead("tasks", (task) => task._id === _id, "completed", toggle);
      },

      // Tasks
      addTask(task) {
        setLead("tasks", (tasks) => [task, ...tasks]);
      },

      updateTask(task) {
        setLead("tasks", (t) => t._id === task._id, task);
      },

      removeTask(_id) {
        setLead("tasks", (tasks) => tasks.filter((task) => task._id !== _id));
      },

      // Notes
      addNote(note) {
        setLead("notes", (notes) => [note, ...notes]);
      },

      editNote(note) {
        setLead("notes", (n) => n._id === note._id, note);
      },

      removeNote(id) {
        setLead("notes", (notes) => notes.filter((n) => n._id !== id));
      },

      // Contacts
      addContact(contact) {
        setLead("contacts", (contacts) => [contact, ...contacts]);
      },

      editContact(contact) {
        setLead("contacts", (c) => c._id === contact._id, contact);
      },

      removeContact(id) {
        setLead("contacts", (contacts) => contacts.filter((c) => c._id !== id));
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
