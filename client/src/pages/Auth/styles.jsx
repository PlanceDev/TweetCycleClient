import { styled } from "solid-styled-components";

export const PageContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;

  @media screen and (max-width: 768px) {
    height: 90vh;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export const AuthHeader = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex: 10%;
  border-bottom: 1px solid #eaeaea;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    font-family: "Poppins", sans-serif;
  }
`;

export const AuthBody = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex: 80%;
`;

export const AuthTextDiv = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex: 10%;
  text-align: center;
  width: 75%;

  p {
    font-size: 0.9rem;
    color: #a3a3a3;
  }
`;

export const AuthForm = styled("form")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  min-width: 300px;

  /* change input focus */
  input:focus {
    outline: 1px solid #788fa1;
  }
`;

export const AuthDiv = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const AuthNameDiv = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const AuthNameInput = styled("input")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid #eaeaea;
  height: 35px;
  padding: 15px;
`;

export const AuthLabel = styled("label")`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.9rem;
`;

export const AuthInput = styled("input")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid #eaeaea;
  height: 35px;
  padding: 15px;
`;

export const AuthFooter = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex: 10%;
  border-top: 1px solid #eaeaea;
`;

export const AuthButton = styled("button")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid #eaeaea;
  background-color: #1d9bf0;
  color: #fafafa;
  font-weight: 600;
  font-size: 1rem;
  height: 35px;
  width: 100%;
  transition: 0.2s ease-in-out;

  &:hover {
    background-color: #1a91da;
    color: #fafafa;
  }

  cursor: pointer;
`;

export const ForgotPassword = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex: 10%;
  font-size: 0.9rem;

  a {
    text-decoration: none;
    color: inherit;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const LinkText = styled("span")`
  color: #1d9bf0;
  font-weight: bold;

  a {
    text-decoration: none;
    color: inherit;
  }

  a:hover {
    text-decoration: underline;
  }
`;
