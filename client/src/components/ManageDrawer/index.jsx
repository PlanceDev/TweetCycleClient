import { styled } from "solid-styled-components";
import { createSignal, For, Show, onMount, createEffect } from "solid-js";
import { Fade } from "@suid/material";
import { CircularProgress } from "@suid/material";
import { Box, Button, Drawer } from "@suid/material";
import { toast } from "solid-toast";
import axios from "axios";

import { HiSolidLogout } from "solid-icons/hi";
import { AiFillTool } from "solid-icons/ai";
import { BiRegularImageAdd } from "solid-icons/bi";
import { OcSmiley2 } from "solid-icons/oc";
import { FaSolidRobot } from "solid-icons/fa";
import { FaRegularTrashCan } from "solid-icons/fa";
import { ImAttachment } from "solid-icons/im";

import { useManageDrawer } from "../../stores/manageDrawerStore";
import { useUser } from "../../stores/userStore";
import { useLeads } from "../../stores/leadsStore";
import { DrawerContainer } from "./styles";

import AddLead from "./AddLead";
import AddContact from "./AddContact";

import { SOLID_APP_API_SERVER } from "../../config";

const ShowLoading = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          "justify-content": "center",
          "align-items": "center",
          height: "100%",
          gap: "1rem",
        }}
      >
        <CircularProgress />

        <span>
          <strong>
            <Show when={isScheduling()} fallback="loading...">
              Loading...
            </Show>
          </strong>
        </span>
      </div>
    </>
  );
};

export default function ManageDrawer() {
  const [user] = useUser();
  const [loading, setLoading] = createSignal(false);
  const [manageDrawer, { closeManageDrawer }] = useManageDrawer();
  const drawer = () => (
    <Box sx={{ width: 350 }} role="presentation">
      <DrawerContainer>
        {loading() ? (
          <>
            <ShowLoading />
          </>
        ) : (
          <>
            <Show when={manageDrawer.type === "add-lead"}>
              <AddLead />
            </Show>

            <Show when={manageDrawer.type === "add-contact"}>
              <AddContact />
            </Show>
          </>
        )}
      </DrawerContainer>
    </Box>
  );

  return (
    <div>
      <Drawer anchor={"right"} open={manageDrawer.open}>
        {drawer()}
      </Drawer>
    </div>
  );
}
