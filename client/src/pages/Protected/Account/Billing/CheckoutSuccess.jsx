import { styled } from "solid-styled-components";
import axios from "axios";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useSubscription } from "../../../../stores/subscriptionStore";
import { useUser } from "../../../../stores/userStore";
import { SOLID_APP_API_SERVER } from "../../../../config";
import { CircularProgress } from "@suid/material";
import { toast } from "solid-toast";

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [user, { initializeUser }] = useUser();
  const [subscription, { initializeSubscription }] = useSubscription();
  const [loading, setLoading] = createSignal(true);

  onMount(() => {
    setTimeout(() => {
      axios
        .post(
          `${SOLID_APP_API_SERVER}/checkout/success-redirect`,
          { complete: true },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.status !== 200) {
            return toast.success(
              "Something went wrong! Please try again later."
            );
          }

          initializeSubscription(res.data.subscription);
          initializeUser(res.data.user);

          return toast.success("Successfully subscribed!");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
          navigate("/a/account/billing");
        });
    }, 2000);
  });

  return (
    <RedirectContainer>
      <h3>Completing your payment...</h3>

      <Show when={loading()}>
        <CircularProgress />
      </Show>
    </RedirectContainer>
  );
}

const RedirectContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 0 1rem;
  text-align: center;
`;
