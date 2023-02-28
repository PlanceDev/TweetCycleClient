import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import SelectSetttings from "../../../../components/SelectSettings";
import axios from "axios";
import { CircularProgress } from "@suid/material";
import { SOLID_APP_API_SERVER } from "../../../../config";
import { useUser } from "../../../../stores/userStore";
import { useSubscription } from "../../../../stores/subscriptionStore";
import { toast } from "solid-toast";

export default function Billing() {
  const [user, { initializeUser, updateUser, logoutUser }] = useUser();
  const [subscription, { initializeSubscription }] = useSubscription();
  const [loading, setLoading] = createSignal(false);

  const handleUpgrade = () => {
    setLoading(true);
    axios
      .get(`${SOLID_APP_API_SERVER}/checkout/?plan=premium`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status !== 200) {
          return toast.error("Something went wrong! Please try again later.");
        }

        window.location.href = res.data.url;
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      });
  };

  const handleCancelSubscription = () => {
    setLoading(true);
    axios
      .put(
        `${SOLID_APP_API_SERVER}/subscription/${subscription._id}`,
        {
          status: "cancelled",
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status !== 200) {
          return toast.error("Something went wrong! Please try again later.");
        }

        initializeSubscription(res.data.subscription);
        initializeUser(res.data.user);

        return toast.success("Successfully cancelled subscription!");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  createEffect(() => {
    if (user._id && subscription._id) {
      return;
    }
  });

  return (
    <>
      <SettingsContainer>
        <SelectSetttings selectedPage={"Billing"} />
        <BillingBody>
          <PlanContainer>
            <h2>Membership</h2>
            <StatusDiv>
              <label>Plan</label>
              <span>
                {subscription.plan.charAt(0).toUpperCase() +
                  subscription.plan.slice(1)}
              </span>
            </StatusDiv>

            <StatusDiv>
              <label>Status</label>
              <span>
                {subscription.status.charAt(0).toUpperCase() +
                  subscription.status.slice(1)}
              </span>
            </StatusDiv>

            <StatusDiv>
              <label>Subscription End Date</label>
              <span>
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            </StatusDiv>
          </PlanContainer>

          <Show when={!loading()}>
            <ManagePlanContainer>
              <Show
                when={
                  subscription.plan === "trial" ||
                  subscription.status === "cancelled"
                }
              >
                <p>
                  Tweet Cycle Premium gives you access to all of our premium
                  features beyond the 14 day trial. 30 day money back guarantee.
                  Cancel anytime.
                </p>

                <BillingButton onClick={handleUpgrade}>
                  Upgrade to Premium
                </BillingButton>
              </Show>

              <Show
                when={
                  subscription.plan !== "trial" &&
                  subscription.status === "active"
                }
              >
                <CancelManageDiv>
                  <p>
                    Thank you for being a Premium Tweet Cycle member. We hope
                    you are enjoying the benefits of our premium features.
                  </p>

                  <ButtonsDiv>
                    {/* <span>
                      {user.stripeCardBrand} ending in {user.stripePaymentLast4}
                    </span> */}

                    {/* <ChangePaymentMethodButton>
                      <span>Update Payment Method</span>
                    </ChangePaymentMethodButton> */}
                  </ButtonsDiv>

                  <ButtonsDiv>
                    <CancelSubscriptionButton
                      onClick={handleCancelSubscription}
                    >
                      Cancel Subscription
                    </CancelSubscriptionButton>
                  </ButtonsDiv>
                </CancelManageDiv>
              </Show>
            </ManagePlanContainer>
          </Show>

          <Show when={loading()}>
            <LoadingContainer>
              <CircularProgress />

              <h4>Processing...</h4>
            </LoadingContainer>
          </Show>
        </BillingBody>
      </SettingsContainer>
    </>
  );
}

const LoadingContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  height: 200px;
`;

const SettingsContainer = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 15px;
  overflow-y: auto;
`;

const BillingButton = styled("button")`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1d9bf0;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  padding: 10px;
  border-radius: 2px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #1d9bf0;
    opacity: 0.8;
  }
`;

const BillingBody = styled("div")`
  display: flex;
  flex-direction: column;

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #788fa1;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: #1d9bf0;
  }
`;

const PlanContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  p {
    font-size: 0.9rem;
    margin-bottom: 20px;
    color: #a3a3a3;
  }
`;

const ManagePlanContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  p {
    font-size: 0.9rem;
    margin-bottom: 20px;
    color: #a3a3a3;
  }
`;

const StatusDiv = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 600;
  padding: 10px 0px;
  gap: 20px;
  width: 100%;
  border-bottom: 1px solid #eaeaea;
`;

const CancelManageDiv = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px 0px;
  font-size: 1rem;
  gap: 10px;
  border-bottom: 1px solid #eaeaea;
`;

const ChangePaymentMethodButton = styled("button")`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1d9bf0;
  color: #fff;
  font-size: 0.8rem;
  padding: 10px;
  border-radius: 2px;
  gap: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border: 1px solid #1d9bf0;

  &:hover {
    background-color: #fff;
    color: #1d9bf0;
    border: 1px solid #1d9bf0;
  }
`;

const CancelSubscriptionButton = styled("button")`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  color: red;
  font-size: 1rem;
  padding: 10px;
  border-radius: 2px;
  border: 1px solid red;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: red;
    color: #fff;
  }
`;

const ButtonsDiv = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  span {
    font-size: 0.8rem;
    font-weight: 500;
  }
`;
