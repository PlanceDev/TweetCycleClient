import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import axios from "axios";
import { SOLID_APP_API_SERVER } from "../../../config";
import { toast } from "solid-toast";
import { CircularProgress } from "@suid/material";
import {
  PageContainer,
  AuthHeader,
  AuthBody,
  AuthFooter,
  AuthForm,
  AuthInput,
  AuthDiv,
  AuthLabel,
  AuthNameDiv,
  AuthNameInput,
  AuthButton,
  AuthTextDiv,
  ForgotPassword,
  LinkText,
} from "../styles";
import { useUser } from "../../../stores/userStore";
import { useSubscription } from "../../../stores/subscriptionStore";

export default function Login() {
  const navigate = useNavigate();
  const [user, { initializeUser }] = useUser();
  const [subscription, { initializeSubscription }] = useSubscription();
  const [loading, setLoading] = createSignal(false);

  const [formData, setFormData] = createSignal({
    email: "",
    pw: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData(),
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let checkFields = ["email", "pw"];

    if (checkFields.some((field) => !formData()[field])) {
      return toast.error("All fields are required!");
    }

    setLoading(true);

    setTimeout(() => {
      axios
        .post(`${SOLID_APP_API_SERVER}/auth/login`, formData(), {
          withCredentials: true,
        })
        .then((res) => {
          initializeUser(res.data.user);
          initializeSubscription(res.data.subscription);
          navigate("/a/schedule");
        })
        .catch((err) => {
          if (err.response.status === 401) {
            navigate("/auth/resend-email");
            return toast.error("You must verify your email first!");
          }

          if (err.response.status === 422) {
            return toast.error("All fields are required!");
          }

          return toast.error("Invalid credentials!");
        })
        .finally(() => setLoading(false));
    }, 500);
  };

  return (
    <>
      <PageContainer>
        <AuthHeader>
          <h2>Sign In</h2>
        </AuthHeader>

        <AuthBody>
          {loading() ? (
            <AuthTextDiv>
              <CircularProgress />
            </AuthTextDiv>
          ) : (
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

              <AuthDiv>
                <AuthLabel for="password">Password</AuthLabel>
                <AuthInput
                  autocomplete="new-password"
                  type="password"
                  name="pw"
                  value={formData().pw}
                  onChange={(e) => handleInputChange(e)}
                />
              </AuthDiv>

              <div>
                <AuthButton type="submit">Log in</AuthButton>
              </div>

              <ForgotPassword>
                <A href="/auth/forgot-password">Forgot password?</A>
              </ForgotPassword>
            </AuthForm>
          )}
        </AuthBody>

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
