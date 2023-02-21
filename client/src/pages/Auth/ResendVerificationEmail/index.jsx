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

export default function ResendVerificationEmail() {
  const [verificationSent, setVerificationSent] = createSignal(true);
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
      .post(`${SOLID_APP_API_SERVER}/auth/resend-email`, formData())
      .then((res) => {
        console.log(res);
        toast.success("Verification email sent!");
        setVerificationSent(true);
      })
      .catch((err) => {
        return toast.error("Something went wrong! Please try again later.");
      });
  };

  return (
    <>
      <PageContainer>
        <AuthHeader>
          <h2>Verify Email</h2>
        </AuthHeader>

        {verificationSent() ? (
          <>
            <AuthBody>
              <AuthTextDiv>
                <span>
                  A verification link has been sent to your email address.
                  <p>
                    If you did not receive an email, please check your spam
                    folder.
                  </p>
                </span>

                <LinkText>
                  <span
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => setVerificationSent(false)}
                  >
                    Resend verification email
                  </span>
                </LinkText>
              </AuthTextDiv>
            </AuthBody>
          </>
        ) : (
          <AuthBody>
            <div>
              <p>
                Please enter your email address to receive a verification email.
              </p>
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
