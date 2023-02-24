import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import { UserProvider } from "./stores/userStore";
import { SubscriptionProvider } from "./stores/subscriptionStore";
import { TweetProvider } from "./stores/tweetStore";
import { ScheduleProvider } from "./stores/scheduleStore";
import { RightDrawerProvider } from "./stores/rightDrawerStore";
import { PublishedProvider } from "./stores/publishedStore";
import "./index.css";
import App from "./App";

render(
  () => (
    <UserProvider>
      <PublishedProvider>
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
      </PublishedProvider>
    </UserProvider>
  ),

  document.getElementById("root")
);
