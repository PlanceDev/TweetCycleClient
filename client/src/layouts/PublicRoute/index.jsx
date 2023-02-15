import { useNavigate, Outlet } from "@solidjs/router";
import Navbar from "../../components/Navbar";

export default function PublicRoute() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
