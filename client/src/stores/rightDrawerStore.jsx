import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export const RightDrawerContext = createContext([]);

export function RightDrawerProvider(props) {
  const [rightDrawer, setRightDrawer] = createStore({
    open: false,
    type: null,
  });

  const drawerActions = [
    rightDrawer,
    {
      openRightDrawer() {
        setRightDrawer({ open: true });
      },

      closeRightDrawer() {
        setRightDrawer({ open: false });
      },

      setRightDrawerType(type) {
        setRightDrawer({ type });
      },
    },
  ];

  return (
    <RightDrawerContext.Provider value={drawerActions}>
      {props.children}
    </RightDrawerContext.Provider>
  );
}

export function useDrawer() {
  return useContext(RightDrawerContext);
}
