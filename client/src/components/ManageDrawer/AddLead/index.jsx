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
    title: "",
    email: "",
    phone: "",
    twitter: "",
    url: "",
    location: "",
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
              <span>Company (or lead Name)*</span>
            </label>

            <ManageDrawerInput
              type="text"
              placeholder="Company"
              name="company"
              value={lead().name}
              onChange={(e) => handleInputChange(e)}
              autoComplete="off"
            />
          </InputDiv>

          <InputDiv>
            <label htmlFor="">
              <span>Contact Name *</span>
            </label>

            <ManageDrawerInput
              type="text"
              placeholder="Name"
              name="contact"
              value={lead().contact}
              onChange={(e) => handleInputChange(e)}
              autoComplete="off"
            />
          </InputDiv>

          <InputDiv>
            <label htmlFor="">
              <span>Contact Title</span>
            </label>

            <ManageDrawerInput
              type="text"
              placeholder="Title"
              name="title"
              value={lead().title}
              onChange={(e) => handleInputChange(e)}
              autoComplete="off"
            />
          </InputDiv>

          <InputDiv>
            <label htmlFor="">
              <span>Contact Email</span>
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
              <span>Contact Phone</span>
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
              <span>Contact Twitter</span>
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
              <span>Contact URL</span>
            </label>
            <ManageDrawerInput
              type="text"
              placeholder="URL"
              name="url"
              value={lead().url}
              onChange={(e) => handleInputChange(e)}
              autoComplete="off"
            />
          </InputDiv>

          <InputDiv>
            <label htmlFor="">
              <span>Contact Location</span>
            </label>
            <ManageDrawerInput
              type="text"
              placeholder="Location"
              name="location"
              value={lead().location}
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
