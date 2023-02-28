import { styled } from "solid-styled-components";
import { useNavigate } from "@solidjs/router";
import logo from "../../assets/tcl-dark.png";

export default function NavbarBrand() {
  const navigate = useNavigate();
  return (
    <NavBrand onClick={() => navigate("/")}>
      <img src={logo} alt="" />
      <span>Tweet Cycle</span>
      <span
        style={{
          color: "#1da1f2",
          "font-size": "0.8rem",
        }}
      >
        {/* ALPHA */}
      </span>
    </NavBrand>
  );
}

const NavBrand = styled("div")`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-family: "Righteous";
  gap: 10px;
  cursor: pointer;

  img {
    height: 25px;
  }

  span {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    font-size: larger;
  }
`;
