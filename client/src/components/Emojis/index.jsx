import { styled } from "solid-styled-components";
import {
  createEffect,
  createSignal,
  For,
  onMount,
  Show,
  useContext,
} from "solid-js";
import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";

export default function Emojis({ onPickEmoji }) {
  let pickerOptions = {
    onEmojiSelect: (emoji) => {
      onPickEmoji(emoji);
    },
    emojiSize: 20,
    emoji: "point_up",
    perLine: 8,
    title: "Pick your emoji…",
    emojiTooltip: true,
    autoFocusSearch: false,
    theme: "light",
  };

  let picker = new Picker({ data, ...pickerOptions });

  return (
    <>
      <EmojiPickerDiv>{picker}</EmojiPickerDiv>
    </>
  );
}

const EmojiPickerDiv = styled("div")`
  /* position: absolute;
  left: 0;
  right: 0; */
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: center;
`;

const EmoijiInnerDiv = styled("div")`
  display: flex;
  align-items: center;
  overflow-y: hidden;
  overflow-x: hidden;
`;
