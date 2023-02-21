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

export default function ForgotPassword() {
  const [resetSent, setResetSent] = createSignal(false);
  const [formData, setFormData] = createSignal({
    email: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData(),
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (["email"].some((field) => !formData()[field])) {
      return toast.error("Email is required!");
    }

    axios
      .post(`${SOLID_APP_API_SERVER}/auth/forgot-password`, formData())
      .then((res) => {
        console.log(res);
        toast.success("Password reset email sent!");
        setResetSent(true);
      })
      .catch((err) => {
        return toast.error("Something went wrong! Please try again later.");
      });
  };

  return (
    <>
      <PageContainer>
        <AuthHeader>
          <h2>Forgot Password</h2>
        </AuthHeader>

        {resetSent() ? (
          <>
            <AuthBody>
              <AuthTextDiv>
                <p>
                  If an account with that email exists, we've sent you a link to
                  reset your password.
                </p>
              </AuthTextDiv>
            </AuthBody>
          </>
        ) : (
          <AuthBody>
            <div>
              <p>We'll send you a link to reset your password.</p>
            </div>
            <AuthForm onSubmit={handleSubmit}>
              <AuthDiv>
                <AuthLabel for="email">Email</AuthLabel>
                <AuthInput
                  autocomplete="new-password"
                  type="email"
                  name="email"
                  value={formData().email}
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
