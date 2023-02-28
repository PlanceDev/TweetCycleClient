import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { AiOutlineMenu } from "solid-icons/ai";
import NavbarBrand from "../NavbarBrand";
import { useUser } from "../../stores/userStore";

export default function Navbar() {
  const [isMobile, setIsMobile] = createSignal(false);
  const [links, setLinks] = createSignal({});
  const [user, setUser] = useUser();

  const navigate = useNavigate();

  // make nav sticky on scroll
  createEffect(() => {
    const nav = document.getElementById("navbar");
    const sticky = nav.offsetTop + 10;

    const handleScroll = () => {
      if (window.pageYOffset >= sticky) {
        nav.style.position = "fixed";
        nav.style.opacity = "0.9";
      } else {
        nav.style.opacity = "1";
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const handleLinkClick = (e) => {
    if (window.location.pathname !== "/") {
      return navigate(`/`);
    }

    links()[e.target.innerText.toLowerCase()].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleToggle = () => {
    setIsMobile(!isMobile());
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

  createEffect(() => {
    if (isMobile()) {
      window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
          setIsMobile(false);
        }
      });
    }
  });

  return (
    <NavBar id="navbar">
      <NavInner>
        <NavLeft>
          <NavbarBrand />

          <MenuToggle onClick={handleToggle}>
            <AiOutlineMenu size="2rem" />
          </MenuToggle>
        </NavLeft>

        <Show when={!isMobile()}>
          <NavCenter>
            <NavItem onClick={handleLinkClick}>
              <span>About</span>
            </NavItem>

            <NavItem onClick={handleLinkClick}>
              <span>Features</span>
            </NavItem>

            <NavItem onClick={handleLinkClick}>
              <span>Pricing</span>
            </NavItem>

            {/* <NavItem onClick={handleLinkClick}>
              <span>Blog</span>
            </NavItem> */}
          </NavCenter>

          <NavRight>
            <Show when={!user.isAuth}>
              <LoginText onClick={() => navigate("/auth/login")}>
                Log In
              </LoginText>

              <SignupButton onClick={() => navigate("/auth/register")}>
                Get Started
              </SignupButton>
            </Show>

            <Show when={user.isAuth}>
              <SignupButton onClick={() => navigate("/a/schedule")}>
                Dashboard
              </SignupButton>
            </Show>
          </NavRight>
        </Show>
      </NavInner>
    </NavBar>
  );
}

const NavBar = styled("nav")`
  display: flex;
  background: #0f1419;
  height: fit-content;
  color: #fff;
  text-align: center;
  width: 100%;
  z-index: 100;
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    flex-direction: column;

    justify-content: center;
    align-items: center;
    gap: 10px;
  }
`;

const NavInner = styled("div")`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 15px;

  @media (max-width: 768px) {
    flex-direction: column;

    justify-content: center;
    align-items: center;
    gap: 10px;
  }
`;

const NavLeft = styled("div")`
  display: flex;
  flex: 33%;
  align-items: center;
  justify-content: flex-start;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 10px;
  }
`;

const MenuToggle = styled("div")`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const NavCenter = styled("div")`
  display: flex;
  flex: 33%;
  align-items: center;
  justify-content: center;
  gap: 20px;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const NavItem = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 1rem;

  &:hover {
    color: #1da1f2;
  }

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    font-size: 1.2rem;
  }
`;

const NavRight = styled("div")`
  display: flex;
  flex: 33%;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 1rem;
    flex-direction: column;
  }
`;

const LoginText = styled("span")`
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    color: #1da1f2;
  }

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    font-size: 1.2rem;
  }
`;

const SignupButton = styled("button")`
  background: #1da1f2;
  color: #fff;
  border: none;
  border-radius: 2px;
  width: 150px;
  height: 40px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  letter-spacing: 2px;

  &:hover {
    background: #1a91da;
  }
`;
