import { styled } from "solid-styled-components";
import { useNavigate, A } from "@solidjs/router";
import axios from "axios";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { BsCalendar2CheckFill } from "solid-icons/bs";
import { IoPersonAddSharp } from "solid-icons/io";
import { IoLogoTwitter } from "solid-icons/io";
import { BsGlobe } from "solid-icons/bs";
import { AiFillPhone } from "solid-icons/ai";
import { AiFillMail } from "solid-icons/ai";
import { FaSolidCircleInfo } from "solid-icons/fa";
import { Tooltip } from "@hope-ui/solid";
import { useManageDrawer } from "../../../stores/manageDrawerStore";
import { useContacts } from "../../../stores/contactsStore";
import ManageDrawer from "../../../components/ManageDrawer";
import {
  ActionPill,
  ScheduleHeader,
  ActionPillsDiv,
} from "../../../components/Styles";
import { SOLID_APP_API_SERVER } from "../../../config";

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
    navigate(`/a/leads/${selectedContact.lead}`);
  };

  onMount(() => {
    axios
      .get(`${SOLID_APP_API_SERVER}/contact`, { withCredentials: true })
      .then((res) => {
        initializeContacts(res.data.contacts);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <>
      <ManageDrawer />

      <ContactsContainer>
        <ScheduleHeader>
          <span>Contacts</span>

          {/* <ActionPillsDiv>
            <ActionPill onClick={() => handleAddContact()}>
              <IoPersonAddSharp />
              Add Contact
            </ActionPill>
          </ActionPillsDiv> */}
        </ScheduleHeader>

        <ContactsBody>
          <ContactInformation>
            <FaSolidCircleInfo />
            <p>
              You can create a new contact by creating a new lead or adding more
              contacts to and already exisiting lead.
            </p>
          </ContactInformation>

          <Show when={contacts.length}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Lead</TableHeader>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Title</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Phone</TableHeader>
                  <TableHeader>Twitter</TableHeader>
                  <TableHeader>URL</TableHeader>
                </TableRow>
              </TableHead>

              <TableBody>
                {contacts.map((contact) => (
                  <ContactTableRow>
                    <CompanyTableData
                      onClick={() => handleViewContact(contact)}
                    >
                      {contact.company.slice(0, 15)}
                      {contact.company.length > 15 && "..."}
                    </CompanyTableData>

                    <TableData>{contact.name}</TableData>
                    <TableData>{contact.title}</TableData>

                    <Tooltip
                      withArrow
                      label={contact.email}
                      placement="top"
                      disabled={!contact.email}
                      openDelay={500}
                    >
                      <IconTableData disabled={!contact.email}>
                        <AiFillMail />
                      </IconTableData>
                    </Tooltip>

                    <Tooltip
                      withArrow
                      label={contact.phone}
                      placement="top"
                      disabled={!contact.phone}
                      openDelay={500}
                    >
                      <IconTableData disabled={!contact.phone}>
                        <AiFillPhone />
                      </IconTableData>
                    </Tooltip>

                    <Tooltip
                      withArrow
                      label={contact.twitter}
                      placement="top"
                      disabled={!contact.twitter}
                      openDelay={500}
                    >
                      <IconTableData disabled={!contact.twitter}>
                        <IoLogoTwitter />
                      </IconTableData>
                    </Tooltip>

                    <Tooltip
                      withArrow
                      label={contact.twitter}
                      placement="top"
                      disabled={!contact.twitter}
                      openDelay={500}
                    >
                      <IconTableData disabled={!contact.twitter}>
                        <BsGlobe />
                      </IconTableData>
                    </Tooltip>
                  </ContactTableRow>
                ))}
              </TableBody>
            </Table>
          </Show>

          <Show when={!contacts.length}>
            <div>No contacts found</div>
          </Show>
        </ContactsBody>
      </ContactsContainer>
    </>
  );
}

const ContactsContainer = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 15px;
  overflow-y: auto;
  font-family: "Poppins", sans-serif;
`;

const ContactsBody = styled("div")`
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

const ContactInformation = styled("div")`
  display: flex;
  gap: 10px;
  align-items: center;
  color: #8d8d8d;

  p {
    font-size: 12px;
    text-align: left;
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
  /* border-radius: 7px 7px 0 0; */
`;

const TableHead = styled("thead")`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background-color: #0f1419;
  color: #fafafa;
`;

const TableRow = styled("tr")`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const ContactTableRow = styled("tr")`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const TableBody = styled("tbody")`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  font-weight: 500;
`;

const TableHeader = styled("th")`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const CompanyTableData = styled("td")`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
  border: 1px solid #ccc;
  max-width: 100px;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #1d9bf0;
  }
`;

const TableData = styled("td")`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
  border: 1px solid #ccc;
  max-width: 100px;
`;

const IconTableData = styled("td")`
  display: table-cell;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
  border: 1px solid #ccc;
  width: 30px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  color: ${(props) => (props.disabled ? "#ccc" : "#333")};

  svg {
    width: 100%;
  }

  &:hover {
    color: ${(props) => (props.disabled ? "#ccc" : "#1d9bf0")};
    z-index: 10;
  }
`;

const PageHeader = styled("div")`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const ContactCardTitle = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: space-between;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 600;
`;

const ContactCard = styled("div")`
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

const ContactCardLeft = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const ContactCardCenter = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const ContactCardRight = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const ContactCardImage = styled("img")`
  width: 25px;
  height: 25px;
  border-radius: 50%;
`;

const ContactCardName = styled("div")`
  font-size: 1rem;
  font-weight: 600;
`;

const ContactCardEmail = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const ContactCardPhone = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const ContactCardTwitter = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const ContactCardTwitterFollowers = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const ContactCardTwitterVerified = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const ContactCardTwitterProfileImage = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const ContactCardDate = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const ContactCardTime = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const ContactCardStatus = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;

const ContactCardActions = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const ContactCardAction = styled("div")`
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

const ContactCardActionIcon = styled("div")`
  font-size: 1.2rem;
  color: #666;
`;

const ContactCardActionText = styled("div")`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
`;
