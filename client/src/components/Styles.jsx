import { styled } from "solid-styled-components";

export const ActionPill = styled("button")`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  color: #aaa;
  background-color: transparent;
  border: 1px solid #a3a3a3;
  padding: 5px 15px;
  font-weight: 500;
  font-size: 0.8rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #eee;
  }

  svg {
    height: 15px;
    width: 15px;
    color: #a3a3a3 !important;
  }
`;

export const ActionPillsDiv = styled("div")`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
