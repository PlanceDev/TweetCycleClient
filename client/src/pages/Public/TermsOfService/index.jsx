import { styled } from "solid-styled-components";
import { createEffect, createSignal, Show, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function TermsOfService() {
  const terms = [
    {
      title: "Content",
      body: "Our tool uses AI technology to generate content tailored to your audience. You are solely responsible for the content that you post using our tool. We reserve the right to remove any content that violates our Terms or Twitter's terms of service.",
    },
    {
      title: "Access",
      body: "You must be at least 18 years old to use our tool. We reserve the right to terminate or suspend your access to our tool at any time, with or without cause.",
    },
    {
      title: "Use",
      body: "Our tool is for your personal or commercial use only. You may not use our tool for any illegal or unauthorized purpose.",
    },
    {
      title: "Privacy",
      body: "We take your privacy seriously and will only use your personal information in accordance with our Privacy Policy.",
    },
    {
      title: "Liability",
      body: "We are not liable for any damages, direct or indirect, resulting from the use of our tool.",
    },
    {
      title: "Intellectual Property",
      body: "Our tool and all of its content, including but not limited to text, graphics, logos, images, and software, are the property of our company or our licensors and are protected by copyright, trademark, and other intellectual property laws.",
    },
    {
      title: "Disclaimer",
      body: "Our tool is provided on an “as is” and “as available” basis. We make no representations or warranties of any kind, express or implied, as to the operation of our tool or the information, content, or materials included on our tool. You expressly agree that your use of our tool is at your sole risk.",
    },
    {
      title: "Limitation of Liability",
      body: "In no event shall our company, nor any of its officers, directors and employees, be liable to you for anything arising out of or in any way connected with your use of our tool, whether such liability is under contract, tort or otherwise, and our company, including its officers, directors and employees shall not be liable for any indirect, consequential or special liability arising out of or in any way related to your use of our tool.",
    },
    {
      title: "Indemnification",
      body: "You agree to indemnify and hold harmless our company, its directors, officers, employees, affiliates, licensors and suppliers, from and against any losses, liabilities, damages, costs, demands, expenses, and any other claims or actions of any kind including but not limited to reasonable legal and accounting fees, brought by third parties as a result of or arising out of your breach of these Terms or the documents they incorporate by reference, or your violation of any law or the rights of a third party.",
    },
    {
      title: "Severability",
      body: "If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect and enforceable.",
    },
    {
      title: "Modification",
      body: "We reserve the right to modify these Terms at any time. If we do, we will post the revised Terms on this page and update the Effective Date. Your continued use of our tool after the Effective Date constitutes your acceptance of the revised Terms.",
    },
    {
      title: "Changes",
      body: "We reserve the right to modify these Terms at any time. If we do, we will post the revised Terms on this page and update the Effective Date. Your continued use of our tool after the Effective Date constitutes your acceptance of the revised Terms.",
    },
    {
      title: "Governing Law",
      body: "These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.",
    },
    {
      title: "Prohibited Content",
      body: "You may not use our tool to post, link to, or otherwise make available any content that: (i) is unlawful, threatening, abusive, harassing, defamatory, libelous, deceptive, fraudulent, invasive of another's privacy, tortious, contains explicit or graphic descriptions or accounts of sexual acts (including but not limited to sexual language of a violent or threatening nature directed at another individual or group of individuals), or otherwise violates our rules or policies; (ii) infringes any patent, trademark, trade secret, copyright, right of publicity, or other proprietary right of any party; (iii) constitutes unauthorized or unsolicited advertising, junk or bulk email (also known as “spamming”), chain letters, any other form of unauthorized solicitation, or any form of lottery or gambling; (iv) contains software viruses or any other computer code, files, or programs designed to interrupt, destroy, or limit the functionality of any computer software or hardware or telecommunications equipment; (v) disrupts the normal flow of dialogue, causes a screen to “scroll” faster than other users of the tool are able to type, or otherwise acts in a manner that negatively affects other users' ability to engage in real time exchanges; (vi) impersonates any person or entity, including any of our employees or representatives.",
    },
    {
      title: "Prohibited Conduct",
      body: "You may not use our tool to: (i) harass, abuse, or harm another person; (ii) impersonate any person or entity, including any of our employees or representatives; (iii) engage in any illegal or unauthorized use of our tool; (iv) interfere with, disrupt, or create an undue burden on our tool or the networks or services connected to our tool; (v) attempt to impersonate another user or person; (vi) use our tool to advertise or offer to sell goods and services; (vii) harvest or otherwise collect information about others, including email addresses, without their consent; (viii) violate any applicable law or regulation.",
    },
    {
      title: "Termination",
      body: "We may terminate or suspend your access to our tool immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.",
    },
    {
      title: "Third-Party Services",
      body: "Our tool may contain links to third-party web sites or services that are not owned or controlled by our company. Our company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that our company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services. We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.",
    },
    {
      title: "User Data",
      body: "We will maintain certain data that you transmit to the tool for the purpose of managing the performance of the tool, as well as data relating to your use of the tool. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the tool. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.",
    },
    {
      title: "Disclaimer of Endorsement",
      body: "We do not endorse any content or information posted on our tool, and we expressly disclaim any and all liability in connection with content. We do not permit copyright infringing activities and infringement of intellectual property rights on our tool, and we will remove all content and information if properly notified that such content or information infringes on another's intellectual property rights. We reserve the right to remove content and information and terminate accounts of users who infringe upon the intellectual property rights of others in any way.",
    },
    {
      title: "Change of Terms",
      body: "We reserve the right to modify these Terms at any time. If we do, we will post the revised Terms on this page and update the Effective Date. Your continued use of our tool after the Effective Date constitutes your acceptance of the revised Terms.",
    },
    {
      title: "Entire Agreement",
      body: "These Terms constitute the entire agreement between us regarding our tool, and supersede and replace any prior agreements we might have between us regarding our tool.",
    },
    {},
  ];

  return (
    <TermsContainer>
      <TermHeader>
        <h1>Terms & Conditions</h1>
      </TermHeader>

      {terms.map((term, index) => (
        <Term key={index}>
          <TermTitle>{term.title}</TermTitle>
          <TermBody>{term.body}</TermBody>
        </Term>
      ))}
    </TermsContainer>
  );
}

const TermsContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 10px;
  font-family: "Poppins", sans-serif;
`;

const TermHeader = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 10px;
  font-family: "Poppins", sans-serif;
  margin-top: 100px;
`;

const Term = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 50%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TermTitle = styled("div")`
  display: flex;
  font-size: larger;
  font-weight: bold;
  margin-right: 10px;
  color: "#1D9BF0" !important;
`;

const TermBody = styled("div")`
  display: flex;
  font-weight: normal;
`;
