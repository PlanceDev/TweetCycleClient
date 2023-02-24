import { styled } from "solid-styled-components";
import { useNavigate, Outlet } from "@solidjs/router";
import { useUser } from "../../stores/userStore";
import NavbarBrand from "../../components/NavbarBrand";

export default function AuthRoute() {
  const [user] = useUser();
  const navigate = useNavigate();

  if (!localStorage.getItem("isAuth")) {
    return (
      <>
        <PageContainer>
          <MobileNav>
            <NavbarBrand />
          </MobileNav>

          <PageLeft>
            <NavbarBrand />
          </PageLeft>

          <PageRight>
            <Outlet />
          </PageRight>
        </PageContainer>
      </>
    );
  } else {
    return navigate("/a/schedule");
  }
}

const PageContainer = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100vh;

  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
`;

const PageLeft = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 20%;
  background-color: #0f1419;
  color: #fafafa;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const PageRight = styled("div")`
  display: flex;
  flex-direction: column;
  flex: 80%;
`;

// Mobile Nav hidden on desktop
const MobileNav = styled("div")`
  color: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 10vh;
  background-color: #0f1419;
  box-shadow: 5px 0 10px rgba(14, 14, 14, 0.2);
  display: flex;

  @media screen and (min-width: 768px) {
    display: none;
  }
`;
