import { styled } from "solid-styled-components";
import { useNavigate, A } from "@solidjs/router";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import axios from "axios";
import { toast } from "solid-toast";
import { SOLID_APP_API_SERVER } from "../../../config";
import {
  PageContainer,
  AuthHeader,
  AuthBody,
  AuthFooter,
  AuthTextDiv,
  LinkText,
} from "../styles";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [token, setToken] = createSignal("");
  const [emailVerified, setEmailVerified] = createSignal(false);

  createEffect(() => {
    let t = new URLSearchParams(window.location.search).get("token");
    setToken(t);
  });

  createEffect(() => {
    if (!token()) {
      return toast.error("Invalid token!");
    }

    axios
      .post(`${SOLID_APP_API_SERVER}/auth/verify-email`, {
        token: token(),
      })
      .then((res) => {
        console.log(res);
        toast.success("Email verified!");
        setEmailVerified(true);
        navigate("/auth/login");
      })
      .catch((err) => {
        return toast.error("Something went wrong! Please try again later.");
      });
  });

  return (
    <>
      <PageContainer>
        <AuthHeader>
          <h2>Reset Password</h2>
        </AuthHeader>

        {emailVerified() ? (
          <>
            <AuthBody>
              <AuthTextDiv>
                <p>Your email has been verified!</p>
              </AuthTextDiv>
            </AuthBody>
          </>
        ) : (
          <AuthBody>
            <span>Loading...</span>
          </AuthBody>
        )}

        <AuthFooter>
          <p>
            Don't have an account?{" "}
            <LinkText>
              <A href="/auth/register">Sign up</A>
            </LinkText>
          </p>
        </AuthFooter>
      </PageContainer>
    </>
  );
}
