import { styled } from "solid-styled-components";
import { useNavigate, A } from "@solidjs/router";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import axios from "axios";
import { toast } from "solid-toast";
import { SOLID_APP_API_SERVER } from "../../../config";
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
  LinkText,
} from "../styles";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(false);
  const [verificationSent, setVerificationSent] = createSignal(false);
  const [formData, setFormData] = createSignal({
    firstName: "",
    lastName: "",
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

    let checkFields = ["firstName", "lastName", "email", "pw"];

    if (checkFields.some((field) => !formData()[field])) {
      return toast.error("All fields are required!");
    }

    if (!formData().email.includes("@") || !formData().email.includes(".")) {
      return toast.error("Please enter a valid email address!");
    }

    if (formData().firstName.length > 20 || formData().lastName.length > 20) {
      return toast.error(
        "First and last name must be less than 20 characters!"
      );
    }

    if (formData().firstName.length < 2 || formData().lastName.length < 2) {
      return toast.error("First and last name must be at least 2 characters!");
    }

    if (formData().pw.length < 8) {
      return toast.error("Password must be at least 8 characters!");
    }

    setLoading(true);

    setTimeout(() => {
      axios
        .post(`${SOLID_APP_API_SERVER}/auth/register`, formData())
        .then((res) => {
          console.log(res);
          toast.success("Registration successful!");
          setVerificationSent(true);
          navigate("/auth/resend-email");
        })
        .catch((err) => {
          if (err.response.status === 409) {
            return toast.error("A user with that email already exists!");
          }

          if (err.response.status === 422) {
            return toast.error("All fields are required!");
          }

          return toast.error("Something went wrong! Please try again later.");
        })
        .finally(() => setLoading(false));
    }, 500);
  };

  return (
    <>
      <PageContainer>
        <AuthHeader>
          <h2>Sign Up</h2>
        </AuthHeader>

        <AuthBody>
          {loading() ? (
            <CircularProgress />
          ) : (
            <AuthForm onSubmit={handleSubmit}>
              <AuthNameDiv>
                <AuthDiv>
                  <AuthLabel for="email">First Name</AuthLabel>
                  <AuthNameInput
                    autocomplete="new-password"
                    type="text"
                    name="firstName"
                    value={formData().firstName}
                    onChange={(e) => handleInputChange(e)}
                  />
                </AuthDiv>

                <AuthDiv>
                  <AuthLabel for="email">Last Name</AuthLabel>
                  <AuthNameInput
                    autocomplete="new-password"
                    type="text"
                    name="lastName"
                    value={formData().lastName}
                    onChange={(e) => handleInputChange(e)}
                  />
                </AuthDiv>
              </AuthNameDiv>

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
                <AuthButton type="submit">Sign Up</AuthButton>
              </div>
            </AuthForm>
          )}
        </AuthBody>

        <AuthFooter>
          <p>
            Already have an account?{" "}
            <LinkText>
              <A href="/auth/login">Login</A>
            </LinkText>
          </p>
        </AuthFooter>
      </PageContainer>
    </>
  );
}
