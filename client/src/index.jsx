import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import { UserProvider } from "./stores/userStore";
import { SubscriptionProvider } from "./stores/subscriptionStore";
import { TweetProvider } from "./stores/tweetStore";
import { ScheduleProvider } from "./stores/scheduleStore";
import { RightDrawerProvider } from "./stores/rightDrawerStore";
import "./index.css";
import App from "./App";

render(
  () => (
    <UserProvider>
      <SubscriptionProvider>
        <ScheduleProvider>
          <TweetProvider>
            <RightDrawerProvider>
              <Router>
                <App />
              </Router>
            </RightDrawerProvider>
          </TweetProvider>
        </ScheduleProvider>
      </SubscriptionProvider>
    </UserProvider>
  ),

  document.getElementById("root")
);
