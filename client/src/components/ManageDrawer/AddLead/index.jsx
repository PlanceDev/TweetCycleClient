import { styled } from "solid-styled-components";
import { createSignal, For, Show, onMount, createEffect } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import axios from "axios";
import { HiSolidLogout } from "solid-icons/hi";
import {
  DrawerHeader,
  DrawerMiddle,
  BottomDiv,
  DrawerBottom,
  ManageDrawerInput,
  TopDiv,
  AddLeadButton,
  InputDiv,
  ManageDrawerTextArea,
} from "../styles";
import { useManageDrawer } from "../../../stores/manageDrawerStore";
import { useUser } from "../../../stores/userStore";
import { useLeads } from "../../../stores/leadsStore";
import { toast } from "solid-toast";
import { SOLID_APP_API_SERVER } from "../../../config";

export default function AddLead() {
  const [user] = useUser();
  const [leads, { initializeLeads, addLead }] = useLeads();
  const [lead, setLead] = createSignal({
    company: "",
    contact: "",
    email: "",
    twitter: "",
    phone: "",
    note: "",
  });

  const [manageDrawer, { closeManageDrawer }] = useManageDrawer();

  const handleInputChange = (e) => {
    setLead({
      ...lead(),
      [e.target.name]: e.target.value,
    });
  };

  const handlesaveLead = (e) => {
    e.preventDefault();

    let checkFields = ["company", "contact"];

    if (checkFields.some((field) => !lead()[field])) {
      return toast.error("company and contact are required!");
    }

    axios
      .post(`${SOLID_APP_API_SERVER}/lead`, lead(), {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status !== 200) {
          return toast.error(res.data.message);
        }

        console.log(res.data.lead);

        addLead(res.data.lead);

        toast.success("Lead added successfully!");
        // initializeLeads();
        // closeManageDrawer();
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
      <DrawerHeader>
        <span>Add A Lead</span>
      </DrawerHeader>

      <DrawerMiddle onSubmit={handlesaveLead}>
        <TopDiv>
          <InputDiv>
            <label htmlFor="">
              <span>Company *</span>
            </label>

            <ManageDrawerInput
              type="text"
              placeholder="Name"
              name="company"
              value={lead().name}
              onChange={(e) => handleInputChange(e)}
              autoComplete="off"
            />
          </InputDiv>

          <InputDiv>
            <label htmlFor="">
              <span>Contact *</span>
            </label>

            <ManageDrawerInput
              type="text"
              placeholder="Contact"
              name="contact"
              value={lead().contact}
              onChange={(e) => handleInputChange(e)}
              autoComplete="off"
            />
          </InputDiv>

          <InputDiv>
            <label htmlFor="">
              <span>Email</span>
            </label>
            <ManageDrawerInput
              type="text"
              placeholder="Email"
              name="email"
              value={lead().email}
              onChange={(e) => handleInputChange(e)}
              autoComplete="off"
            />
          </InputDiv>

          <InputDiv>
            <label htmlFor="">
              <span>Twitter</span>
            </label>
            <ManageDrawerInput
              type="text"
              placeholder="Twitter"
              name="twitter"
              value={lead().twitter}
              onChange={(e) => handleInputChange(e)}
              autoComplete="off"
            />
          </InputDiv>

          <InputDiv>
            <label htmlFor="">
              <span>Phone</span>
            </label>

            <ManageDrawerInput
              type="text"
              placeholder="Phone"
              name="phone"
              value={lead().phone}
              onChange={(e) => handleInputChange(e)}
              autoComplete="off"
            />
          </InputDiv>

          <InputDiv>
            <label htmlFor="">
              <span>Note</span>
            </label>

            <ManageDrawerTextArea
              type="text"
              placeholder="Write a note here..."
              name="note"
              value={lead().note}
              onChange={(e) => handleInputChange(e)}
              autoComplete="off"
            />
          </InputDiv>
        </TopDiv>

        <BottomDiv>
          <AddLeadButton type="submit">Save Lead</AddLeadButton>
        </BottomDiv>
      </DrawerMiddle>

      <DrawerBottom onClick={() => closeManageDrawer()}>
        <HiSolidLogout />

        <span>Collapse</span>
      </DrawerBottom>
    </>
  );
}
