import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import { AiFillCheckCircle } from "solid-icons/ai";
import tclLight from "../../../assets/tcl-light.svg";
import mobileMockUp from "../../../assets/mobile-mockup.svg";
import desktopMockup from "../../../assets/desktop-mockup2.svg";
import gearBird from "../../../assets/gear-bird.png";
import aboutView from "../../../assets/about-view.svg";
import VerticalTimeline from "./VerticalTimeline";
import { BsTwitter, BsDiscord } from "solid-icons/bs";

export default function Home() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <>
      <HeroContainer>
        <HeroBanner>
          <HeroBannerLeft>
            <HeroBannerLeftText>
              <span>
                <p>
                  <HighlightedText> INTUITIVE </HighlightedText>
                  <span>TWITTER MANAGEMEMENT</span>
                </p>

                <h1>
                  AI powered Twitter <HighlightedText>growth</HighlightedText>
                </h1>

                <p>Generate. Schedule. Automate.</p>
              </span>
            </HeroBannerLeftText>

            <CallToAction>
              <p>
                Start your <HighlightedText>14-day free trial</HighlightedText>.{" "}
                <br /> No Credit Card Required.
              </p>
              <TrialButton onClick={() => navigate("/auth/register")}>
                Let's Go
              </TrialButton>
            </CallToAction>
          </HeroBannerLeft>

          <HeroBannerRight>
            <HeroBannerDesktopImage>
              <img src={desktopMockup} alt="" />
            </HeroBannerDesktopImage>

            <HeroBannerMobileImage>
              <img src={mobileMockUp} alt="" />
            </HeroBannerMobileImage>
          </HeroBannerRight>
        </HeroBanner>
      </HeroContainer>

      <AboutContainer id="about">
        <AboutHeader>
          <h1>How it works.</h1>
        </AboutHeader>

        <AboutBody>
          <AboutBodyLeft>
            <AboutImg>
              <img src={aboutView} alt="" />
            </AboutImg>
          </AboutBodyLeft>

          <AboutBodyRight>
            <AboutItem>
              <h4>Generate</h4>

              <p>
                Personalized Content Creation: Our tool generates content that
                is tailored to your audience and reflects your unique voice. We
                use machine learning algorithms to identify the topics that your
                followers are interested in, and then we create tweets that are
                both engaging and informative.
              </p>
            </AboutItem>

            <AboutItem>
              <h4>Schedule</h4>

              <p>
                Plan and create your tweets ahead of time and schedule them to
                be posted at a later date and time for maximum engagement and
                reach. This includes the ability to schedule threads and tweets.
              </p>
            </AboutItem>

            {/* <AboutItem>
              <h4>Automate</h4>

              <p>
                Fully autonomous: We take care of everything. Our tool will
                generate and schedule your tweets for you, so you can focus on
                other aspects of your business. You can also use our tool to
                find new followers and engage with them. We will automatically
                send them a direct message, follow them back, and like and
                respond to replies to your tweets.
              </p>
            </AboutItem> */}

            <AboutItem>
              <h4>
                {" "}
                Manage <span>Coming Soon </span>{" "}
              </h4>

              <p>
                Manage all of your accounts in one place. Our tool allows you to
                manage multiple accounts and switch between them with ease. You
                can also manage your contacts and leads in one place.
              </p>
            </AboutItem>
          </AboutBodyRight>
        </AboutBody>
      </AboutContainer>

      <FeaturesContainer id="features">
        <FeatureHeader>
          <h1>Automation At Every Step.</h1>
        </FeatureHeader>

        <FeaturesBody>
          <VerticalTimeline />

          <FeatureImg>
            <img src={gearBird} alt="" />
          </FeatureImg>
        </FeaturesBody>
      </FeaturesContainer>

      <PricingContainer id="pricing">
        <PricingHeader>
          <h1>Simple Pricing.</h1>
          <p>
            Limited time only. Premium access for only $10 /mo! Cancel anytime.
          </p>
        </PricingHeader>

        <PricingBody>
          <PricingPlan>
            <PricingPlanDetailsHeader>
              <h1>Premium</h1>

              <h2>$10 /mo</h2>
            </PricingPlanDetailsHeader>

            <PricingPlanDetails>
              <PricingPlanDetailItem>
                <AiFillCheckCircle />1 Twitter Account
              </PricingPlanDetailItem>

              <PricingPlanDetailItem>
                <AiFillCheckCircle />
                Unlimited Scheduled Tweets
              </PricingPlanDetailItem>

              <PricingPlanDetailItem>
                <AiFillCheckCircle />
                Unlimited AI Generated Tweets
              </PricingPlanDetailItem>

              <PricingPlanDetailItem>
                <AiFillCheckCircle />
                Unlimited Contacts & Leads
              </PricingPlanDetailItem>
            </PricingPlanDetails>
          </PricingPlan>
        </PricingBody>

        <PricingBodyLeftButton>
          <TrialButton onClick={() => navigate("/auth/register")}>
            Start Your 14-day Free Trial
          </TrialButton>
        </PricingBodyLeftButton>
      </PricingContainer>

      <FooterContainer>
        <FooterCenter>
          <Socials>
            <SocialsItem>
              <a href="https://twitter.com/TweetCycleAI">
                <BsTwitter />
              </a>
            </SocialsItem>

            <SocialsItem>
              <a href="#">
                <BsDiscord />
              </a>
            </SocialsItem>
          </Socials>
          <span>Join Our Community</span>
        </FooterCenter>
        <FooterLeft>
          <FooterLeftLogo>
            <img src={tclLight} alt="" />
          </FooterLeftLogo>

          <FooterLeftText>
            <p>
              © {year} <span>Tweet Cycle</span>.
            </p>
          </FooterLeftText>
        </FooterLeft>

        <FooterRight>
          <FooterRightLink>
            <A href="/terms-of-service">Terms of Service</A>
          </FooterRightLink>

          <FooterRightLink>
            <A href="/terms-of-service">Privacy Policy</A>
          </FooterRightLink>
        </FooterRight>
      </FooterContainer>
    </>
  );
}

const HeroContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: "Poppins", sans-serif;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const HeroBanner = styled("div")`
  display: flex;
  flex-direction: row;
  background-color: #f5f5f5;
  height: 95vh;

  /* justify-content: center;
  align-items: center; */

  @media (max-width: 864px) {
    flex-direction: column;
  }
`;

const HeroBannerLeft = styled("div")`
  display: flex;
  flex-direction: column;
  flex: 50%;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #0f1419 !important;
  /* background-color: aliceblue; */
`;

const HeroBannerLeftText = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  p {
    font-size: 1.1rem;
    margin: 10px 0px;
    letter-spacing: 1px;
  }

  h1 {
    margin: 0;
    font-size: 3.5rem;
  }
`;

const HeroBannerRight = styled("div")`
  display: flex;
  flex: 50%;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  min-width: 50%;
  /* background-color: #5a5a5a; */

  @media (max-width: 864px) {
    display: none;
  }
`;

const HeroBannerDesktopImage = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0px;

  img {
    max-width: 750px;
  }

  @media (max-width: 864px) {
    position: relative;
    img {
      max-width: 75%;
    }
  }
`;

// Hero Section
const HeroBannerMobileImage = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  left: -75px;
  top: 100px;
  animation: float 3s ease-in-out infinite;

  @-moz-document url-prefix() {
    display: none;
  }

  img {
    width: 60%;
  }

  @media (max-width: 864px) {
    display: none;
    left: 0;
  }

  /* make it float up and down */
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

const CallToAction = styled("div")`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-weight: bold;

  justify-content: flex-start;
  align-items: flex-start;

  p {
    font-size: 0.9rem;
    margin: 10px 0px;
    letter-spacing: 2px;
  }
`;

const TrialButton = styled("button")`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffd900;
  color: #0f1419;
  border: none;
  border-radius: 2px;
  min-width: 150px;
  min-height: 40px;
  padding: 10px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;

  transition: 0.3s;
  letter-spacing: 2px;
  text-decoration: none;
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #fafafa;
    color: #1d9bf0;
  }
`;

const HighlightedText = styled("span")`
  font-weight: bold;
  color: #1da1f2;
  /* text-decoration: underline; */
`;

// Features Section

const FeaturesContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
  padding: 3rem;
  font-family: "Poppins", sans-serif;
  min-height: 400px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FeatureHeader = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
  }
`;

const FeaturesBody = styled("div")`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: space-between;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FeatureImg = styled("div")`
  display: flex;
  flex: 50%;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 500px;
    max-width: 600px;
  }

  @media (max-width: 864px) {
    img {
      display: none;
    }
  }
`;

const Feature = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #c0c0c0;
  text-align: center;
  width: 200px;
  height: 200px;

  @media (max-width: 768px) {
  }
`;

// About Section
const AboutContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: space-between;
  gap: 1rem;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
  min-height: 400px;
  background-color: #0f1419;
  color: #fafafa;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AboutHeader = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  h1 {
    font-size: 3rem;
    margin: 0;
    color: #1d9bf0;
  }

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const AboutBody = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: space-between;
  gap: 1rem;
  width: 100%;
  padding: 1rem;

  p {
    font-size: 1rem;
    margin: 10px 0px;
  }

  @media (max-width: 864px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
  }
`;

const AboutBodyLeft = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  flex: 50%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AboutBodyRight = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  flex: 50%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AboutItem = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
  width: fit-content;
  height: fit-content;

  h4 {
    font-size: 1.5rem;
    margin: 0;
    color: #1d9bf0;
  }

  span {
    font-size: 1rem;
    color: #0f1419;
    background-color: #ffd900;
    border-radius: 5px;
    padding: 5px;
  }

  p {
    font-size: 1rem;
    margin: 0;
  }
`;

const AboutImg = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: -30px;
  /* box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2); */

  img {
    width: 550px;
    max-width: 550px;
    border-radius: 7px;
  }

  @media (max-width: 864px) {
    position: relative;
    left: 0;
    text-align: center;

    img {
      width: 100%;
      border-radius: 7px;
    }
  }
`;

// Pricing Section
const PricingContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: space-between;
  gap: 1rem;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
  min-height: 400px;
  background-color: #0f1419;
  color: #fafafa;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PricingHeader = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  h1 {
    font-size: 3rem;
    margin: 0;
    color: #1d9bf0;
  }

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const PricingBody = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 864px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
  }
`;

const PricingPlan = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;
  background-color: #1d9bf0;
  text-align: center;
  min-width: 350px;
  min-height: 400px;
  height: fit-content;
  border-radius: 5px;
  padding: 10px;

  @media (max-width: 768px) {
  }
`;

const PricingPlanDetailsHeader = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  h1 {
    font-size: 2.5rem;
    margin: 0;
  }

  h2 {
    font-size: 1.5rem;
    margin: 0;
    color: #ffd900;
  }
`;

const PricingPlanDetails = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const PricingPlanDetailItem = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  width: 100%;
  font-size: 0.9rem;
`;

const PricingBodyLeftButton = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Footer Section
const FooterContainer = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  gap: 1rem;
  font-family: "Poppins", sans-serif;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FooterLeft = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 33%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FooterCenter = styled("div")`
  display: flex;
  flex: 33%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  color: #788fa1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Socials = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SocialsItem = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  svg {
    color: #788fa1 !important;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FooterRight = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex: 33%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FooterLeftLogo = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 50px;
    height: 50px;
  }
`;

const FooterLeftText = styled("div")`
  p {
    font-size: 0.8rem;
    color: #0f1419;
    font-family: "Poppins", sans-serif;
  }

  span {
    color: #1d9bf0;
  }
`;

const FooterRightLink = styled("div")`
  a {
    font-size: 0.8rem;
    color: #0f1419;
    font-family: "Poppins", sans-serif;
    text-decoration: none;
  }
`;
