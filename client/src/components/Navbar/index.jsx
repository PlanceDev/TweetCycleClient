import { styled } from "solid-styled-components";

export default function Navbar() {
  return (
    <NavBar>
      <span></span>
    </NavBar>
  );
}

const NavBar = styled("nav")`
  background: #333;
  height: 5vh;
  color: #fff;
  text-align: center;
  padding: 10px;
`;
