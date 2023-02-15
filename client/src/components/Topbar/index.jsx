import { styled } from "solid-styled-components";
import { createEffect, createSignal } from "solid-js";
import { ImSearch } from "solid-icons/im";
import { Box, Popper, Fade } from "@suid/material";
import { RiDesignQuillPenFill } from "solid-icons/ri";
import RightDrawer from "../RightDrawer";
import { useDrawer } from "../../stores/rightDrawerStore";
import { useTweet } from "../../stores/tweetStore";

const BoxStyle = {
  width: "350px",
  height: "300px",
  backgroundColor: "background.paper",
  border: "1px solid #e0e0e0",
  boxShadow: "1px",
  p: 0.5,
};

export default function Topbar() {
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
      id: Math.floor(Math.random() * 1000000),
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
          <WriteTweetButton onClick={handleShowRightDrawer}>
            <RiDesignQuillPenFill />
            <span>Create a Tweet</span>
          </WriteTweetButton>
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
  height: 5vh;
  padding: 10px;
  color: #fff;
  border-bottom: 0.1rem solid #e0e0e0;
  /* box-shadow: 0 0 0.3rem 0.1rem #00000047; */
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

const WriteTweetButton = styled("button")`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 2px;
  border: none;
  height: 100%;
  background-color: #1da1f2;
  color: #fff;
  padding: 0 10px;
  margin-left: 10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #1a91da;
  }

  @media screen and (min-width: 768px) {
    display: flex;
  }
`;
