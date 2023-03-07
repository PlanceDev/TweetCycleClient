import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export const ManageDrawerContext = createContext([]);

export function ManageDrawerProvider(props) {
  const [manageDrawer, setManageDrawer] = createStore({
    open: false,
    type: null,
  });

  const manageDrawerActions = [
    manageDrawer,
    {
      openManageDrawer() {
        setManageDrawer({ open: true });
      },

      closeManageDrawer() {
        setManageDrawer({ open: false });
      },

      manageDrawerType(type) {
        setManageDrawer({ type });
      },
    },
  ];

  return (
    <ManageDrawerContext.Provider value={manageDrawerActions}>
      {props.children}
    </ManageDrawerContext.Provider>
  );
}

export function useManageDrawer() {
  return useContext(ManageDrawerContext);
}
