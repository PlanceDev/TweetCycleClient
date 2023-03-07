import { styled } from "solid-styled-components";

export const AuthDiv = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const AuthNameDiv = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const AuthInput = styled("input")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid #eaeaea;
  height: 35px;
  padding: 10px;
  font-size: 0.8rem;
`;
