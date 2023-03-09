import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { AiOutlineMenu } from "solid-icons/ai";
import axios from "axios";
import { useUser } from "../../stores/userStore";
import { SOLID_APP_API_SERVER } from "../../config";

export default function MobileNavbar() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = createSignal(true);
  const [links, setLinks] = createSignal({});
  const [open, setOpen] = createSignal(false);
  const [user, { logoutUser }] = useUser();

  const handleToggle = () => {
    setOpen(!open());
  };

  const handleLinkClick = (link) => {
    setOpen(false);
    navigate(link);
  };

  const handleLogout = () => {
    axios
      .get(`${SOLID_APP_API_SERVER}/auth/logout`, {
        withCredentials: true,
      })
      .finally(() => {
        logoutUser();
        navigate("/auth/login");
      });
  };

  onMount(() => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    }

    setLinks({
      features: document.getElementById("features"),
      pricing: document.getElementById("pricing"),
      about: document.getElementById("about"),
      blog: document.getElementById("blog"),
    });
  });

  return (
    <MobileNavContainer>
      <NavLeft>
        <AiOutlineMenu color={"#fff"} onClick={handleToggle} />
      </NavLeft>

      <Show when={open()}>
        <NavRight>
          <LinksDiv>
            <NavItem onClick={() => handleLinkClick("/a/schedule")}>
              Schedule
            </NavItem>

            <NavItem onClick={() => handleLinkClick("/a/tweet-generator")}>
              Tweet Generator
            </NavItem>

            <NavItem onClick={() => handleLinkClick("/a/thread-generator")}>
              Thread Generator
            </NavItem>

            <NavItem onClick={() => handleLinkClick("/a/leads")}>Leads</NavItem>

            <NavItem onClick={() => handleLinkClick("/a/contacts")}>
              Contacts
            </NavItem>

            <NavItem onClick={() => handleLinkClick("/a/account")}>
              Account
            </NavItem>

            <NavItem onClick={() => handleLogout()}>Logout</NavItem>
          </LinksDiv>
        </NavRight>
      </Show>
    </MobileNavContainer>
  );
}

// Mobile Nav hidden on desktop
const MobileNavContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: fit-content;
  background-color: #0f1419;
  color: #fff;
  box-shadow: 5px 0 10px rgba(14, 14, 14, 0.2);
  display: flex;
  /* width: 100%; */

  svg {
    width: 30px;
    height: 30px;
  }

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const NavLeft = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  flex: 33%;
`;

const NavRight = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  flex: 33%;
  width: 100%;
`;

const LinksDiv = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
`;

const NavItem = styled("div")`
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 1rem;
  padding: 10px;

  &:hover {
    color: #1da1f2;
  }

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    font-size: 1.2rem;
  }
`;
