import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import SelectSetttings from "../../../components/SelectSettings";
import axios from "axios";
import { SOLID_APP_API_SERVER } from "../../../config";
import { AuthInput, AuthDiv, AuthNameDiv } from "./styles";
import { useUser } from "../../../stores/userStore";
import ConnectTwitter from "../../../components/ConnectTwitter";
import { toast } from "solid-toast";

export default function Account() {
  const [selectedPage, setSelectedPage] = createSignal("General");
  const [user, { initializeUser, updateUser, logoutUser }] = useUser();

  const [passwordDisable, setPasswordDisabled] = createSignal(true);

  const [profileForm, setProfileForm] = createSignal({
    name: user.firstName + " " + user.lastName,
    email: user.email,
  });

  const [passwordForm, setPasswordForm] = createSignal({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  createEffect(() => {
    if (
      passwordForm().currentPassword &&
      passwordForm().newPassword &&
      passwordForm().confirmPassword
    ) {
      return setPasswordDisabled(false);
    }
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  onMount(async () => {
    axios
      .get(`${SOLID_APP_API_SERVER}/user/`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status !== 200) {
          return toast.error("Something went wrong! Please try again later.");
        }
      })
      .catch((err) => {
        console.log(err);
        return toast.error("Something went wrong! Please try again later.");
      });
  });

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    if (passwordForm().newPassword !== passwordForm().confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    if (passwordForm().newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters!");
    }

    if (passwordForm().currentPassword === passwordForm().newPassword) {
      return toast.error(
        "New password must be different from current password!"
      );
    }

    axios
      .put(`${SOLID_APP_API_SERVER}/user/${user._id}`, passwordForm(), {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status !== 200) {
          return toast.error("Something went wrong! Please try again later.");
        }

        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        return toast.success("Password updated successfully!");
      })
      .catch((err) => {
        console.log(err);
        return toast.error("Something went wrong! Please try again later.");
      });
  };

  return (
    <SettingsContainer>
      <SelectSetttings selectedPage={selectedPage} />

      <SettingsBody>
        <ProfileContainer>
          <h2>Profile</h2>
          <p>
            Your email address is your identity on Tweet Cycle and is used to
            log you in and send notifications about your account.
          </p>

          <AuthDiv>
            <AuthNameDiv>
              <label>Email</label>
              <AuthInput disabled={true} type="text" value={user.email} />
            </AuthNameDiv>

            <AuthNameDiv>
              <label>Name</label>
              <AuthInput
                disabled={true}
                type="text"
                value={user.firstName + " " + user.lastName}
              />
            </AuthNameDiv>

            <SettingsButtonDiv>
              {/* <SettingsButton>Save Changes</SettingsButton> */}
            </SettingsButtonDiv>
          </AuthDiv>

          <AuthDiv></AuthDiv>
        </ProfileContainer>

        <PasswordContainer>
          <h2>Password</h2>
          <p>
            Your password is used to log in to your account. We recommend using
            a strong password that you don't use anywhere else.
          </p>

          <AuthDiv>
            <AuthNameDiv>
              <label>Current Password</label>
              <AuthInput
                name="currentPassword"
                type="password"
                onChange={handlePasswordChange}
              />
            </AuthNameDiv>

            <AuthNameDiv>
              <label>New Password</label>
              <AuthInput
                name="newPassword"
                type="password"
                onChange={handlePasswordChange}
              />
            </AuthNameDiv>

            <AuthNameDiv>
              <label>Confirm New Password</label>
              <AuthInput
                name="confirmPassword"
                type="password"
                onChange={handlePasswordChange}
              />
            </AuthNameDiv>

            <SettingsButtonDiv>
              <SettingsButton
                onClick={handleUpdatePassword}
                disabled={passwordDisable()}
              >
                Update Password
              </SettingsButton>
            </SettingsButtonDiv>
          </AuthDiv>
        </PasswordContainer>

        {/* <TwitterContainer>
          <h2>Twitter</h2>

          <Show when={!user.twitterId}>
            <p>
              Connect your Twitter account to Tweet Cycle to schedule tweets and
              access exclusive features.
            </p>
            <ConnectTwitter />
          </Show>

          <Show when={user.twitterId}>
            <p>
              Disconnecting your Twitter will remove access to important
              features and will halt your scheduled tweets.
            </p>

            <DisconnectTwitterButton>
              Disconnect Twitter
            </DisconnectTwitterButton>
          </Show>
        </TwitterContainer> */}
      </SettingsBody>
    </SettingsContainer>
  );
}

const SettingsContainer = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 15px;
  overflow-y: auto;
`;

const SettingsBody = styled("div")`
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

const ProfileContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 15px;
  /* background-color: #fff; */
  /* box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1); */
  border-bottom: 1px solid #eaeaea;

  p {
    font-size: 0.9rem;
    margin-bottom: 20px;
    color: #a3a3a3;
  }
`;

const PasswordContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 15px;
  /* background-color: #fff; */

  border-bottom: 1px solid #eaeaea;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 10px;
  }

  p {
    font-size: 0.9rem;
    margin-bottom: 20px;
    color: #a3a3a3;
  }
`;

const SettingsButtonDiv = styled("div")`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 5px;
  margin-top: 10px;
`;

const SettingsButton = styled("button")`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  border: none;
  background-color: #1d9bf0;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:disabled {
    background-color: #1d9bf0;
    opacity: 0.5;

    &:hover {
      background-color: #1d9bf0;
      opacity: 0.5;

      cursor: not-allowed;
    }
  }

  &:hover {
    background-color: #1d9bf0;
    opacity: 0.8;
  }
`;

const TwitterContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 15px;
  /* background-color: #fff; */

  h2 {
    font-size: 1.5rem;
    font-weight: 600;

    margin-bottom: 10px;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }

  p {
    font-size: 0.9rem;
    margin-bottom: 20px;
    color: #a3a3a3;
  }
`;

const DisconnectTwitterButton = styled("button")`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  border: none;
  background-color: #1d9bf0;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:disabled {
    background-color: #1d9bf0;
    opacity: 0.5;

    &:hover {
      background-color: #1d9bf0;
      opacity: 0.5;

      cursor: not-allowed;
    }
  }

  &:hover {
    background-color: #1d9bf0;
    opacity: 0.8;
  }
`;
