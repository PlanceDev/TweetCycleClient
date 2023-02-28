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
  AuthForm,
  AuthInput,
  AuthDiv,
  AuthLabel,
  AuthButton,
  AuthTextDiv,
  LinkText,
} from "../styles";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [token, setToken] = createSignal("");
  const [passowrdReset, setPasswordReset] = createSignal(false);
  const [formData, setFormData] = createSignal({
    pw: "",
    confirmPw: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData(),
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (["pw", "confirmPw"].some((field) => !formData()[field])) {
      return toast.error("All fields are required!");
    }

    if (formData().pw !== formData().confirmPw) {
      return toast.error("Passwords do not match!");
    }

    axios
      .put(`${SOLID_APP_API_SERVER}/auth/reset-password`, {
        token: token(),
        pw: formData().pw,
        confirmPw: formData().confirmPw,
      })
      .then((res) => {
        if (res.status !== 200) {
          return toast.error("Something went wrong! Please try again later.");
        }

        toast.success("Password successfully reset!");
        setPasswordReset(true);
        navigate("/auth/login");
      })
      .catch((err) => {
        return toast.error("Something went wrong! Please try again later.");
      });
  };

  createEffect(() => {
    let t = new URLSearchParams(window.location.search).get("token");
    setToken(t);

    if (!token()) {
      return toast.error("Invalid token!");
    }
  });

  return (
    <>
      <PageContainer>
        <AuthHeader>
          <h2>Reset Password</h2>
        </AuthHeader>

        {passowrdReset() ? (
          <>
            <AuthBody>
              <AuthTextDiv>
                <p>Password has been successfully reset!</p>
              </AuthTextDiv>
            </AuthBody>
          </>
        ) : (
          <AuthBody>
            <div>
              <p>Create and confirm your new password.</p>
            </div>
            <AuthForm onSubmit={handleSubmit}>
              <AuthDiv>
                <AuthLabel for="pw">Password</AuthLabel>
                <AuthInput
                  autocomplete="new-password"
                  type="password"
                  name="pw"
                  value={formData().pw}
                  onChange={(e) => handleInputChange(e)}
                />

                <AuthLabel for="confirmPw">Confirm Password</AuthLabel>
                <AuthInput
                  autocomplete="new-password"
                  type="password"
                  name="confirmPw"
                  value={formData().confirmPw}
                  onChange={(e) => handleInputChange(e)}
                />
              </AuthDiv>

              <div>
                <AuthButton type="submit">Submit</AuthButton>
              </div>
            </AuthForm>
          </AuthBody>
        )}

        <AuthFooter>
          <p>
            <LinkText>
              <A href="/auth/login">Sign In</A>
            </LinkText>
          </p>
        </AuthFooter>
      </PageContainer>
    </>
  );
}
