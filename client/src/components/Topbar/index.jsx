import { styled } from "solid-styled-components";
import { createEffect, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { ImSearch } from "solid-icons/im";
import { Box, Popper, Fade } from "@suid/material";
import { RiDesignQuillPenFill } from "solid-icons/ri";
import { v4 as uuidv4 } from "uuid";
import RightDrawer from "../RightDrawer";
import { useDrawer } from "../../stores/rightDrawerStore";
import { useTweet } from "../../stores/tweetStore";
import { useUser } from "../../stores/userStore";
import { WriteTweetButton } from "../../components/Styles";
import ConnectTwitter from "../ConnectTwitter";
import axios from "axios";
import { SOLID_APP_API_SERVER } from "../../config";

const BoxStyle = {
  width: "350px",
  height: "300px",
  backgroundColor: "background.paper",
  border: "1px solid #e0e0e0",
  boxShadow: "1px",
  p: 0.5,
};

export default function Topbar() {
  const navigate = useNavigate();
  const [user, { logoutUser }] = useUser();

  let boxRef;
  const [anchorEl, setAnchorEl] = createSignal(null);
  const [dropDownOpen, setDropDownOpen] = createSignal(false);
  const [drawer, { openRightDrawer, setRightDrawerType }] = useDrawer();
  const [tweet, { initializeTweet, addTweet }] = useTweet();

  const handleShowDropdown = (event) => {
    if (dropDownOpen()) {
      setAnchorEl(null);
      return setDropDownOpen(false);
    }

    setAnchorEl(event.currentTarget);
    setDropDownOpen(true);
  };

  const handleShowRightDrawer = () => {
    initializeTweet({
      _id: uuidv4(),
      publishDate: new Date(),
      thread: [
        {
          id: 0,
          body: "",
          attachments: [],
        },
      ],
    });
    setRightDrawerType("createTweet");
    openRightDrawer();
  };

  // Create click event listener to close the popper when clicking outside of it
  createEffect(() => {
    if (!boxRef) return;

    document.onclick = (event) => {
      if (
        event.target.id !== "search-input" &&
        event.target.id !== "search-popper"
      ) {
        setDropDownOpen(false);
        setAnchorEl(null);
      }
    };
  });

  createEffect(() => {
    if (!user) return;
  });

  return (
    <>
      <RightDrawer />

      <Container>
        <ContainerLeft>
          {/* <SearchInputContainer ref={boxRef}>
            <SearchIcon>
              <ImSearch />
            </SearchIcon>
            <SearchInput
              disabled={true}
              id={"search-input"}
              onClick={(event) => handleShowDropdown(event)}
              placeholder="Search..."
            />

            <Popper
              id={"search-popper"}
              open={dropDownOpen()}
              anchorEl={anchorEl()}
              placement={"bottom-start"}
            >
              <Fade in={dropDownOpen()} mountOnEnter unmountOnExit>
                <Box sx={BoxStyle} id={"search-popper"}>
                  The content of the Poppers.
                </Box>
              </Fade>
            </Popper>
          </SearchInputContainer> */}
        </ContainerLeft>

        <ContainerRight>
          <Show when={user.twitterId}>
            <WriteTweetButton onClick={handleShowRightDrawer}>
              <RiDesignQuillPenFill />

              <span>Create a Tweet</span>
            </WriteTweetButton>
          </Show>

          <Show when={!user.twitterId}>
            <ConnectTwitter />
          </Show>
        </ContainerRight>
      </Container>
    </>
  );
}

const Container = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #fff;
  height: 10vh;
  padding: 0 10px;
  color: #fff;
  border-bottom: 0.1rem solid #e0e0e0;
`;

const ContainerLeft = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  flex: 50%;

  @media screen and (min-width: 768px) {
    display: flex;
  }
`;

const ContainerRight = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  /* background-color: #a3a3a3; */
  flex: 50%;

  @media screen and (min-width: 768px) {
    display: flex;
  }
`;

const SearchInputContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 50px;
  padding: 0;
  width: 100%;

  svg {
    font-size: 0.7rem;
    margin: 0 10px;
    color: #a3a3a3 !important;
  }

  @media screen and (min-width: 768px) {
    display: flex;
  }
`;

const SearchIcon = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 2rem;
  border-radius: 2px 0px 0px 2px;
  border: none;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-right: none;

  @media screen and (min-width: 768px) {
    display: flex;
  }
`;

const SearchInput = styled("input")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 2rem;
  border-radius: 0px 2px 2px 0px;
  border: none;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-left: none;
  padding: 0;
  width: 75%;
  padding-left: 10px;

  &:focus {
    border-left: none !important;
    outline: none !important;
    border: 1px solid #ccc;
    border-radius: 0px 2px 2px 0px;
    background-color: #fff;
  }

  @media screen and (min-width: 768px) {
    display: flex;
    width: 350px;
  }
`;

const SearchPopper = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: 768px) {
    display: flex;
  }
`;
