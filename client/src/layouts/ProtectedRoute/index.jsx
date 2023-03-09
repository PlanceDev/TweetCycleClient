import { useNavigate, Outlet } from "@solidjs/router";
import { styled } from "solid-styled-components";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { useUser } from "../../stores/userStore";
import MobileNavbar from "../../components/MobileNav";

export default function ProtectedRoute() {
  const [user] = useUser();
  const navigate = useNavigate();

  if (!localStorage.getItem("isAuth")) {
    return navigate("/auth/login");
  } else {
    return (
      <>
        <PageContainer>
          <MobileNavbar />
          <Sidebar />

          <PageRight>
            <Topbar />
            <Outlet />
          </PageRight>
        </PageContainer>
      </>
    );
  }
}

// Wrapper for all authenticated pages
const PageContainer = styled("div")`
  display: flex;
  flex-direction: column;
  font-family: "Poppins", sans-serif;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    height: 100vh;
  }
`;

const PageRight = styled("div")`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 20px !important;
`;

// Mobile Nav hidden on desktop
const MobileNav = styled("div")`
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
