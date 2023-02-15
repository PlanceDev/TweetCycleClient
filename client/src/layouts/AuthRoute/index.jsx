import { useNavigate, Outlet } from "@solidjs/router";
import { useUser } from "../../stores/userStore";

export default function AuthRoute() {
  const [user] = useUser();
  const navigate = useNavigate();

  if (!user.isAuth) {
    return <Outlet />;
  } else {
    return navigate("/a/schedule");
  }
}
