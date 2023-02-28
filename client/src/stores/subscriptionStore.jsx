import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export const SubscriptionContext = createContext({});

export function SubscriptionProvider(props) {
  const [subscription, setSubscription] = createStore({
    _id: localStorage.getItem("sub_id") || "",
    owner: localStorage.getItem("sub_owner") || "",
    plan: localStorage.getItem("sub_plan") || "",
    frequency: localStorage.getItem("sub_frequency") || "",
    status: localStorage.getItem("sub_status") || "",
    currentPeriodEnd: localStorage.getItem("sub_currentPeriodEnd") || "",
  });

  const subscriptionActions = [
    subscription,
    {
      // Initialize the subscription
      initializeSubscription(subscription) {
        localStorage.setItem("sub_id", subscription._id);
        localStorage.setItem("sub_owner", subscription.owner);
        localStorage.setItem("sub_plan", subscription.plan);
        localStorage.setItem("sub_frequency", subscription.frequency);
        localStorage.setItem("sub_status", subscription.status);
        localStorage.setItem(
          "sub_currentPeriodEnd",
          subscription.currentPeriodEnd
        );

        setSubscription(subscription);
      },

      clearSubscription() {
        localStorage.removeItem("sub_id");
        localStorage.removeItem("sub_owner");
        localStorage.removeItem("sub_plan");
        localStorage.removeItem("sub_frequency");
        localStorage.removeItem("sub_status");
        localStorage.removeItem("sub_currentPeriodEnd");

        setSubscription({
          _id: "",
          owner: "",
          plan: "",
          frequency: "",
          status: "",
          currentPeriodEnd: "",
        });
      },
    },
  ];

  return (
    <SubscriptionContext.Provider value={subscriptionActions}>
      {props.children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
