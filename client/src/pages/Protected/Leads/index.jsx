import { styled } from "solid-styled-components";
import { useNavigate, A } from "@solidjs/router";
import axios from "axios";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { BsCalendar2CheckFill } from "solid-icons/bs";
import { IoPersonAddSharp } from "solid-icons/io";
import { AiFillPhone } from "solid-icons/ai";
import { AiFillMail } from "solid-icons/ai";
import { Tooltip } from "@hope-ui/solid";
import { useManageDrawer } from "../../../stores/manageDrawerStore";
import { useLeads } from "../../../stores/leadsStore";
import ManageDrawer from "../../../components/ManageDrawer";
import {
  ActionPill,
  ScheduleHeader,
  ActionPillsDiv,
} from "../../../components/Styles";
import { SOLID_APP_API_SERVER } from "../../../config";

export default function Leads() {
  const navigate = useNavigate();
  const [leads, { initializeLeads }] = useLeads();

  const [
    manageDrawer,
    { openManageDrawer, closeManageDrawer, manageDrawerType },
  ] = useManageDrawer();

  const handleAddLead = () => {
    manageDrawerType("add-lead");
    openManageDrawer();
  };

  const handleViewLead = (selectedLead) => {
    navigate(`/a/leads/${selectedLead._id}`);
  };

  onMount(() => {
    axios
      .get(`${SOLID_APP_API_SERVER}/lead`, { withCredentials: true })
      .then((res) => {
        initializeLeads(res.data.leads);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <>
      <ManageDrawer />

      <LeadsContainer>
        <ScheduleHeader>
          <span>Leads</span>

          <ActionPillsDiv>
            <ActionPill onClick={() => handleAddLead()}>
              <IoPersonAddSharp />
              Add Lead
            </ActionPill>
          </ActionPillsDiv>
        </ScheduleHeader>

        <LeadsBody>
          <Show when={leads.length}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Company</TableHeader>
                  <TableHeader>Contact</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Phone</TableHeader>
                  <TableHeader>Twitter</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableRow>
              </TableHead>

              <TableBody>
                {leads.map((lead) => (
                  <LeadTableRow>
                    <CompanyTableData onClick={() => handleViewLead(lead)}>
                      {lead.company.slice(0, 15)}
                      {lead.company.length > 15 && "..."}
                    </CompanyTableData>

                    <TableData>{lead.contacts[0].name}</TableData>

                    <Tooltip
                      withArrow
                      label={lead.email}
                      placement="top"
                      disabled={!lead.email}
                      openDelay={500}
                    >
                      <IconTableData disabled={!lead.email}>
                        <AiFillMail />
                        {/* {lead.email} */}
                      </IconTableData>
                    </Tooltip>

                    <Tooltip
                      withArrow
                      label={lead.phone}
                      placement="top"
                      disabled={!lead.phone}
                      openDelay={500}
                    >
                      <IconTableData disabled={!lead.phone}>
                        {/* {lead.phone} */}
                        <AiFillPhone />
                      </IconTableData>
                    </Tooltip>

                    <TableData>@{lead.twitter.split("/").pop()}</TableData>
                    <TableData>
                      {lead.status.charAt(0).toUpperCase() +
                        lead.status.slice(1)}
                    </TableData>
                  </LeadTableRow>
                ))}
              </TableBody>
            </Table>
          </Show>

          <Show when={!leads.length}>
            <div>No leads found</div>
          </Show>
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

const LeadTableRow = styled("tr")`
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
