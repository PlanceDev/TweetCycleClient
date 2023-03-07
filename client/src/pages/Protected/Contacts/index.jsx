import { styled } from "solid-styled-components";
import { useNavigate, A } from "@solidjs/router";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import { IoPersonAddSharp } from "solid-icons/io";
import { useManageDrawer } from "../../../stores/manageDrawerStore";
import { useContacts } from "../../../stores/contactsStore";
import ManageDrawer from "../../../components/ManageDrawer";
import {
  ActionPill,
  ScheduleHeader,
  ActionPillsDiv,
} from "../../../components/Styles";

const contactsList = [
  {
    _id: 1,
    name: "John Doe",
    email: "pauljeremybrooks@bellsouth.com",
    phone: "123-456-7890",
    twitter: "@johndoe",
    twitterFollowers: 1000,
    twitterVerified: true,
    twitterProfileImage: "https://placekitten.com/200/300",
    status: "active",
  },
  {
    _id: 2,
    name: "Jacob Sercozydsdfsdfsdfsdfsdfsdf",
    email: "me@me.com",
    phone: "123-456-7890",
    twitter: "@janedoe",
    twitterFollowers: 1000,
    twitterVerified: true,
    twitterProfileImage: "https://placekitten.com/200/300",
    status: "active",
  },
  {
    _id: 3,
    name: "Paul Brooks",
    email: "me@me.com",
    phone: "123-456-7890",
    twitter: "@janedoe",
    twitterFollowers: 1000,
    twitterVerified: true,
    twitterProfileImage: "https://placekitten.com/200/300",
    status: "active",
  },
];

export default function Contacts() {
  const navigate = useNavigate();
  const [contacts, { initializeContacts }] = useContacts();

  const [
    manageDrawer,
    { openManageDrawer, closeManageDrawer, manageDrawerType },
  ] = useManageDrawer();

  const handleAddContact = () => {
    manageDrawerType("add-contact");
    openManageDrawer();
  };

  const handleViewContact = (selectedContact) => {
    navigate(`/a/contacts/${selectedContact._id}`);
  };

  onMount(() => {
    initializeContacts(contactsList);
  });

  return (
    <>
      <ManageDrawer />

      <LeadsContainer>
        <ScheduleHeader>
          <span>Contacts</span>

          <ActionPillsDiv>
            <ActionPill onClick={() => handleAddContact()}>
              <IoPersonAddSharp />
              Add Contact
            </ActionPill>
          </ActionPillsDiv>
        </ScheduleHeader>

        <LeadsBody>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Phone</TableHeader>
                <TableHeader>Twitter</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>

            <TableBody>
              {contacts.map((contact) => (
                <LeadTableRow onClick={() => handleViewContact(contact)}>
                  <TableData>
                    {contact.name.slice(0, 15)}
                    {contact.name.length > 15 && "..."}
                  </TableData>
                  <TableData>{contact.email}</TableData>
                  <TableData>{contact.phone}</TableData>
                  <TableData>{contact.twitter}</TableData>
                  <TableData>{contact.status}</TableData>
                </LeadTableRow>
              ))}
            </TableBody>

            <Show when={!contacts.length}>
              <div>No leads found</div>
            </Show>
          </Table>
        </LeadsBody>
      </LeadsContainer>
    </>
  );
}

const LeadsContainer = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 15px;
  overflow-y: auto;
  font-family: "Poppins", sans-serif;
`;

const LeadsBody = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10% !important;

  table thead tr th {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  table tbody tr td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
`;

const Table = styled("table")`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border: 1px solid #ddd;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  text-align: left;
  line-height: 1.5;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHead = styled("thead")`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const TableRow = styled("tr")`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const LeadTableRow = styled("tr")`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const TableBody = styled("tbody")`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const TableData = styled("td")`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  max-width: 200px;
  overflow: hidden;
`;

const TableDataDiv = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
  }
`;

const TableHeader = styled("th")`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const PageHeader = styled("div")`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const LeadCardTitle = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: space-between;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 600;
`;

const LeadCard = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 10px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  border: 1px solid #eee;
`;

const LeadCardLeft = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const LeadCardCenter = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const LeadCardRight = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const LeadCardImage = styled("img")`
  width: 25px;
  height: 25px;
  border-radius: 50%;
`;

const LeadCardName = styled("div")`
  font-size: 1rem;
  font-weight: 600;
`;

const LeadCardEmail = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const LeadCardPhone = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const LeadCardTwitter = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const LeadCardTwitterFollowers = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const LeadCardTwitterVerified = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const LeadCardTwitterProfileImage = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const LeadCardDate = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const LeadCardTime = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const LeadCardStatus = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const LeadCardActions = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const LeadCardAction = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  padding: 5px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
`;

const LeadCardActionIcon = styled("div")`
  font-size: 1.2rem;
  color: #666;
`;

const LeadCardActionText = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;
