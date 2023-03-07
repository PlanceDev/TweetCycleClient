import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import { UserProvider } from "./stores/userStore";
import { SubscriptionProvider } from "./stores/subscriptionStore";
import { TweetProvider } from "./stores/tweetStore";
import { ScheduleProvider } from "./stores/scheduleStore";
import { RightDrawerProvider } from "./stores/rightDrawerStore";
import { PublishedProvider } from "./stores/publishedStore";
import { DraftedProvider } from "./stores/draftedStore";
import { ManageDrawerProvider } from "./stores/manageDrawerStore";
import { LeadsProvider } from "./stores/leadsStore";
import { ContactsProvider } from "./stores/contactsStore";
import { LeadProvider } from "./stores/leadStore";
import "./index.css";
import App from "./App";

render(
  () => (
    <UserProvider>
      <ManageDrawerProvider>
        <LeadsProvider>
          <LeadProvider>
            <ContactsProvider>
              <PublishedProvider>
                <DraftedProvider>
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
                </DraftedProvider>
              </PublishedProvider>
            </ContactsProvider>
          </LeadProvider>
        </LeadsProvider>
      </ManageDrawerProvider>
    </UserProvider>
  ),

  document.getElementById("root")
);
