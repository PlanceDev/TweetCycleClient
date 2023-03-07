import { styled, css } from "solid-styled-components";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import {
  FaSolidCheck,
  FaSolidCircleXmark,
  FaSolidTrashCan,
} from "solid-icons/fa";
import { AiFillPlusCircle } from "solid-icons/ai";
import {
  Select,
  SelectTrigger,
  SelectPlaceholder,
  SelectValue,
  SelectTag,
  SelectTagCloseButton,
  SelectIcon,
  SelectContent,
  SelectListbox,
  SelectOptGroup,
  SelectLabel,
  SelectOption,
  SelectOptionText,
  SelectOptionIndicator,
} from "@hope-ui/solid";
import { Tooltip } from "@hope-ui/solid";
import { SOLID_APP_API_SERVER, SOLID_APP_MODE } from "../../config";
import { useLead } from "../../stores/leadStore";
import axios from "axios";

const selectors = [
  "New",
  "Engaged",
  "Qualified",
  "Unqualified",
  "Not Interested",
  "Cancelled",
  "Won",
  "Lost",
];

export default function LeadStatus() {
  const [lead, { updateLead }] = useLead();

  const handleChangeStatus = (status) => {
    axios
      .put(
        `${SOLID_APP_API_SERVER}/lead/${lead._id}`,
        {
          type: "status",
          status: status,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (!res.status === 200) return toast.error(res.data.message);
        updateLead(res.data.lead);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  return (
    <>
      <Show when={lead.status}>
        <Select
          defaultValue={lead.status?.toLocaleLowerCase()}
          onChange={handleChangeStatus}
        >
          <SelectTrigger
            borderRadius="3px"
            backgroundColor="#fff"
            _focus={{
              shadow: "$none",
              border: "1px solid #a3a3a3",
            }}
          >
            <SelectPlaceholder>
              {lead.status?.charAt(0).toUpperCase() + lead.status?.slice(1)}
            </SelectPlaceholder>
            <SelectValue />
            <SelectIcon />
          </SelectTrigger>

          <SelectContent>
            <SelectListbox>
              <For each={selectors}>
                {(item) => (
                  <SelectOption value={item?.toLowerCase()}>
                    <SelectOptionText>{item}</SelectOptionText>
                    <SelectOptionIndicator />
                  </SelectOption>
                )}
              </For>
            </SelectListbox>
          </SelectContent>
        </Select>
      </Show>
    </>
  );
}
