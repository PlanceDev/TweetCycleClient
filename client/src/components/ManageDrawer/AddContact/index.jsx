import { styled } from "solid-styled-components";
import { createSignal, For, Show, onMount, createEffect } from "solid-js";
import { DrawerHeader, DrawerMiddle, BottomDiv, DrawerBottom } from "../styles";
import { HiSolidLogout } from "solid-icons/hi";
import { useManageDrawer } from "../../../stores/manageDrawerStore";
import { useUser } from "../../../stores/userStore";
import { useContacts } from "../../../stores/contactsStore";

export default function AddContact() {
  const [user] = useUser();
  const [contacts, { initializeContacts }] = useContacts();
  const [manageDrawer, { closeManageDrawer }] = useManageDrawer();

  return (
    <>
      <DrawerHeader>
        <span>Contacts</span>
      </DrawerHeader>

      <DrawerMiddle></DrawerMiddle>

      <DrawerBottom onClick={() => closeManageDrawer()}>
        <HiSolidLogout />

        <span>Collapse</span>
      </DrawerBottom>
    </>
  );
}
