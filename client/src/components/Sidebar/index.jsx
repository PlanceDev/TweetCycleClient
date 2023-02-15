import { styled } from "solid-styled-components";
import { useNavigate, A } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import {
  HiSolidMail,
  HiSolidUsers,
  HiOutlineMenu,
  HiOutlineTemplate,
  HiSolidCog,
  HiSolidCollection,
  HiSolidLogin,
  HiSolidLogout,
  HiSolidCalendar,
  HiSolidClipboardList,
  HiOutlineTable,
} from "solid-icons/hi";
import { BiRegularTargetLock, BiSolidContact } from "solid-icons/bi";
import { BsClockHistory, BsGearFill, BsTwitter } from "solid-icons/bs";
import { BsFileEarmarkTextFill } from "solid-icons/bs";
import { FaSolidClipboardCheck } from "solid-icons/fa";
import { FaSolidRepeat, FaRegularCalendarDays } from "solid-icons/fa";
import { IoLogOutSharp } from "solid-icons/io";
import { BiRegularLogOutCircle } from "solid-icons/bi";

export default function Sidebar() {
  let toggle;
  let icons;
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = createSignal(true);
  const [active, setActive] = createSignal("inbox");

  const toggleNav = () => {
    setNavOpen(!navOpen());
  };

  createEffect(() => {
    if (navOpen()) {
      toggle.style.width = "198px";
    } else {
      toggle.style.width = "50px";
    }
  });

  return (
    <>
      <SideNav ref={toggle}>
        <SideNavHeader>
          <Show when={navOpen()}>
            <SideNavHeaderLeft>
              <UserName>@Keepah504</UserName>
              <CompanyName>Client Cycle</CompanyName>
            </SideNavHeaderLeft>
          </Show>

          <SideNavHeaderRight>
            <UserAvatar>
              <span>K</span>
            </UserAvatar>
          </SideNavHeaderRight>
        </SideNavHeader>

        <SideNavTop ref={icons}>
          <A href={"/a/schedule"}>
            <LinkWrapper>
              <LinkIcon>
                <FaRegularCalendarDays />
              </LinkIcon>
              <Show when={navOpen()}>
                <LinkText>Schedule</LinkText>
              </Show>
            </LinkWrapper>
          </A>

          <A href={"/a/tweet-generator"}>
            <LinkWrapper>
              <LinkIcon>
                <BsTwitter />
              </LinkIcon>

              <Show when={navOpen()}>
                <LinkText>Tweet Generator</LinkText>
              </Show>
            </LinkWrapper>
          </A>

          <LinkWrapper>
            <LinkIcon>
              <BiSolidContact />
            </LinkIcon>

            <Show when={navOpen()}>
              <LinkText>Contacts</LinkText>
            </Show>
          </LinkWrapper>

          <LinkWrapper>
            <LinkIcon>
              <FaSolidClipboardCheck />
            </LinkIcon>

            <Show when={navOpen()}>
              <LinkText>Projects</LinkText>
            </Show>
          </LinkWrapper>
        </SideNavTop>

        <SideNavMiddle>
          <LinkWrapper>
            <LinkIcon>
              <BsGearFill />
            </LinkIcon>

            <Show when={navOpen()}>
              <LinkText>Settings</LinkText>
            </Show>
          </LinkWrapper>

          <LinkWrapper>
            <LinkIcon>
              <BiRegularLogOutCircle />
            </LinkIcon>

            <Show when={navOpen()}>
              <LinkText>Logout</LinkText>
            </Show>
          </LinkWrapper>
        </SideNavMiddle>

        <SideNavBottom onClick={toggleNav}>
          <Show when={navOpen()}>
            <LinkIcon>
              <HiSolidLogin />
            </LinkIcon>
          </Show>

          <Show when={!navOpen()}>
            <LinkIcon>
              <HiSolidLogout />
            </LinkIcon>
          </Show>
        </SideNavBottom>
      </SideNav>
    </>
  );
}

const SideNav = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 198px;
  background-color: #0f1419;
  display: none;
  color: #fff;
  box-shadow: 0 0 0.5rem 0.3rem #00000047;
  z-index: 1;

  @media screen and (min-width: 768px) {
    display: flex;
    width: 198px;
  }

  a {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: #fff;
    width: 100%;
  }
`;

const SideNavHeader = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5vh;
  padding: 10px;
  color: #788fa1;
  border-bottom: 0.1rem solid #788fa147;
  cursor: pointer;
  margin-bottom: 15px;
`;

const SideNavHeaderLeft = styled("div")`
  display: flex;
  flex-direction: column;
  flex: 50%;
  font-size: 0.8rem;
  align-items: flex-start;
  transition: all 0.3s ease-in-out;
`;

const SideNavHeaderRight = styled("div")`
  display: flex;
  flex: 40%;
  justify-content: flex-end;
  align-items: center;
`;

const UserAvatar = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: #788fa147;
  transition: all 0.3s ease-in-out;
  font-size: 0.8rem;
  font-weight: 600;
`;

const UserName = styled("span")`
  color: #1d9bf0;
  font-weight: 600;
  transition: all 0.3s ease-in-out;
`;

const CompanyName = styled("span")`
  font-weight: 400;
  font-size: 0.7rem;
  color: #788fa1;
`;

// Link Items
const SideNavTop = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 90%;
  gap: 10px;
  padding: 10px;
  color: #fff;
`;

const LinkWrapper = styled("div")`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 5px 0px;

  &:hover {
    background-color: #788fa147;
    color: #fff;
    border-radius: 5px;
  }

  svg {
    color: #788fa1 !important;
    font-size: 1.4rem;
  }
`;

const LinkIcon = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding-left: 5px;
`;

const LinkText = styled("span")`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
`;

const SideNavMiddle = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
  height: fit-content;
  padding: 10px;
  border-top: 0.1rem solid #788fa147;
`;

const SideNavBottom = styled("div")`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  height: fit-content;
  padding: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  border-top: 0.1rem solid #788fa147;

  &:hover {
    color: #fff;
    background-color: #788fa147;
    transition: all 0.2s ease-in-out;
  }

  svg {
    color: #788fa1 !important;
    font-size: 1.4rem;
  }
`;