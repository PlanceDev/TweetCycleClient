import { styled } from "solid-styled-components";

export const DrawerContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`;

export const DrawerHeader = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10vh;
  padding: 10px;
  color: #788fa1;
  border-bottom: 1px solid #788fa147;
  margin-bottom: 10px;
`;

export const DrawerMiddle = styled("form")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90vh;
  color: #788fa1;
  border-bottom: 0.1rem solid #788fa147;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 10px;
`;

export const TopDiv = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  color: #788fa1;
  gap: 10px;
  overflow-y: auto;
`;

export const BottomDiv = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: fit-content;
  padding: 10px;
  gap: 10px;
  color: #788fa1;
  /* background-color: #0f1419; */
  border-top: 0.1rem solid #788fa147;
`;

export const AddLeadButton = styled("button")`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.5rem;
  border: 0.1rem solid #1d9bf0;
  border-radius: 2px;
  outline: none;
  font-size: 1rem;
  color: #fafafa;
  background-color: #1d9bf0;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #1a91da;
  }
`;

export const DrawerBottom = styled("div")`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 10vh;
  gap: 10px;

  cursor: pointer;
  color: #788fa1;
  /* background-color: #0f1419; */
  border-bottom: 0.1rem solid #788fa147;
  padding: 10px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #788fa147;
  }
`;

export const InputDiv = styled("div")`
  display: flex;
  flex-direction: column;
  color: #0f1419;
  gap: 5px;
  width: 100%;

  label {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
    font-weight: 600;
    font-size: 0.8rem;
  }
`;

export const ManageDrawerInput = styled("input")`
  display: flex;
  height: 2.5rem;
  padding: 10px;
  border: 0.1rem solid #788fa147;
  border-radius: 2px;
  outline: none;
  font-size: 1rem;
  color: #788fa1;

  &:focus {
    border: 0.1rem solid #788fa1;
  }
`;

export const ManageDrawerTextArea = styled("textarea")`
  display: flex;
  height: 5rem;
  padding: 10px;
  border: 0.1rem solid #788fa147;
  border-radius: 2px;
  outline: none;
  font-size: 1rem;

  &:focus {
    border: 0.1rem solid #788fa1;
  }

  resize: none;
`;
