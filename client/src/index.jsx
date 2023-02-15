import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import { UserProvider } from "./stores/userStore";
import { TweetProvider } from "./stores/tweetStore";
import { ScheduleProvider } from "./stores/scheduleStore";
import { RightDrawerProvider } from "./stores/rightDrawerStore";
import "./index.css";
import App from "./App";

render(
  () => (
    <UserProvider>
      <ScheduleProvider>
        <TweetProvider>
          <RightDrawerProvider>
            <Router>
              <App />
            </Router>
          </RightDrawerProvider>
        </TweetProvider>
      </ScheduleProvider>
    </UserProvider>
  ),

  document.getElementById("root")
);
