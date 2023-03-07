import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export const LeadsContext = createContext([{}, {}]);

export function LeadsProvider(props) {
  const [leads, setLeads] = createStore([]);

  const leadsActions = [
    leads,
    {
      // Initialize the lead
      initializeLeads(lead) {
        setLeads(lead);
      },

      // Add a lead
      addLead(lead) {
        setLeads([...leads, lead]);
      },
    },
  ];

  return (
    <LeadsContext.Provider value={leadsActions}>
      {props.children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  return useContext(LeadsContext);
}
