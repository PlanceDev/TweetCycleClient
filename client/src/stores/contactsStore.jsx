import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export const ContactsContext = createContext([{}, {}]);

export function ContactsProvider(props) {
  const [contacts, setContacts] = createStore([]);

  const contactsActions = [
    contacts,
    {
      // Initialize the contact
      initializeContacts(contacts) {
        setContacts(contacts);
      },
    },
  ];

  return (
    <ContactsContext.Provider value={contactsActions}>
      {props.children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  return useContext(ContactsContext);
}
