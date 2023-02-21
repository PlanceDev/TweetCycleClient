import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export const SubscriptionContext = createContext({});

export function SubscriptionProvider(props) {
  const [subscription, setSubscription] = createStore({
    _id: localStorage.getItem("sub_id") || "",
    owner: localStorage.getItem("sub_owner") || "",
    plan: localStorage.getItem("sub_plan") || "",
    payPeriod: localStorage.getItem("sub_payPeriod") || "",
    status: localStorage.getItem("sub_status") || "",
    renewalDate: localStorage.getItem("sub_renewalDate") || "",
  });

  const subscriptionActions = [
    subscription,
    {
      // Initialize the subscription
      initializeSubscription(subscription) {
        localStorage.setItem("sub_id", subscription._id);
        localStorage.setItem("sub_owner", subscription.owner);
        localStorage.setItem("sub_plan", subscription.plan);
        localStorage.setItem("sub_payPeriod", subscription.payPeriod);
        localStorage.setItem("sub_status", subscription.status);
        localStorage.setItem("sub_renewalDate", subscription.renewalDate);

        setSubscription(subscription);
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
