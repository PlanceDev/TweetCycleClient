import moment from "moment";
import { styled } from "solid-styled-components";
import { createEffect, createSignal, For, onMount, onCleanup } from "solid-js";
import { TiArrowUpThick, TiArrowDownThick } from "solid-icons/ti";
import { useTweet } from "../../stores/tweetStore";

const HOURS = ["--", Array.from(Array(13).keys())].flat();
const MINUTES = ["--", Array.from(Array(60).keys())].flat();
const AM_PM = ["AM", "PM"];

export default function TimePicker() {
  const [tweet, { initializeTweet, handlePublishDateChange }] = useTweet();
  const [hour, setHour] = createSignal(12);
  const [minute, setMinute] = createSignal(0);
  const [amPm, setAmPm] = createSignal("AM");
  const [date, setDate] = createSignal(null);

  createEffect(() => {
    const publishDate = moment(tweet.publishDate);

    setHour(parseInt(publishDate.format("h")));

    setMinute(parseInt(publishDate.format("mm")));

    setAmPm(publishDate.format("A"));

    setDate(publishDate.format("YYYY-MM-DD"));
  });

  const handleHourChange = (direction) => {
    if (direction === "decrement") {
      if (hour() === 1) {
        return setHour(12);
      } else {
        return setHour(hour() - 1);
      }
    }

    if (direction === "increment") {
      if (hour() === 12) {
        return setHour(1);
      } else {
        return setHour(hour() + 1);
      }
    }
  };

  const handleMinuteChange = (direction) => {
    if (direction === "decrement") {
      if (minute() === 0) {
        return setMinute(59);
      } else {
        return setMinute(minute() - 1);
      }
    }

    if (direction === "increment") {
      if (minute() === 59) {
        return setMinute(0);
      } else {
        return setMinute(minute() + 1);
      }
    }
  };

  const handleAmPmChange = () => {
    if (amPm() === "AM") {
      return setAmPm("PM");
    } else {
      return setAmPm("AM");
    }
  };

  const handleHourSelect = (e) => {
    setHour(e.target.value);
  };

  const handleMinuteSelect = (e) => {
    setMinute(e.target.value);
  };

  const handleAmPmSelect = (e) => {
    setAmPm(e.target.value);
  };

  const handleDateSelect = (e) => {
    setDate(moment(e.target.value).format("YYYY-MM-DD"));
  };

  createEffect(() => {
    if (!date()) return;

    const fDate = moment(date()).format("MM/DD/YYYY");
    const fTime = moment(`${hour()}:${minute()} ${amPm()}`, "hh:mm:a").format(
      "hh:mm A"
    );

    const dateTime = moment(`${fDate} ${fTime}`, "MM/DD/YYYY hh:mm A").format(
      "MM/DD/YYYY hh:mm A"
    );

    handlePublishDateChange(new Date(dateTime).toISOString());
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      <DatePickerContainer>
        <DateInput
          type={"date"}
          value={date()}
          min={moment(new Date()).format("YYYY-MM-DD")}
          onChange={handleDateSelect}
        />
      </DatePickerContainer>

      <TimePickerContainer>
        {/* Hour */}
        <DigitPicker>
          <ArrowPicker onClick={() => handleHourChange("increment")}>
            <TiArrowUpThick />
          </ArrowPicker>

          <DigitDropDown onChange={handleHourSelect}>
            <For each={HOURS}>
              {(item) => (
                <DigitDropDownItem selected={item === hour()}>
                  {item.toString().padStart(2, "0")}
                </DigitDropDownItem>
              )}
            </For>
          </DigitDropDown>

          <ArrowPicker onClick={() => handleHourChange("decrement")}>
            <TiArrowDownThick />
          </ArrowPicker>
        </DigitPicker>

        <span>:</span>

        {/* Minute */}
        <DigitPicker>
          <ArrowPicker onClick={() => handleMinuteChange("increment")}>
            <TiArrowUpThick />
          </ArrowPicker>

          <DigitDropDown onChange={handleMinuteSelect}>
            <For each={MINUTES}>
              {(item) => (
                <DigitDropDownItem selected={item === minute()}>
                  {item.toString().padStart(2, "0")}
                </DigitDropDownItem>
              )}
            </For>
          </DigitDropDown>

          <ArrowPicker onClick={() => handleMinuteChange("decrement")}>
            <TiArrowDownThick />
          </ArrowPicker>
        </DigitPicker>

        <span>:</span>

        {/* AM/PM */}
        <DigitPicker>
          <ArrowPicker onClick={handleAmPmChange}>
            <TiArrowUpThick />
          </ArrowPicker>

          <DigitDropDown onChange={handleAmPmSelect}>
            <For each={AM_PM}>
              {(item) => (
                <DigitDropDownItem selected={item === amPm()}>
                  {item}
                </DigitDropDownItem>
              )}
            </For>
          </DigitDropDown>

          <ArrowPicker onClick={handleAmPmChange}>
            <TiArrowDownThick />
          </ArrowPicker>
        </DigitPicker>
      </TimePickerContainer>
    </div>
  );
}

const TimePickerContainer = styled("div")`
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  border: 1px solid #ccc;
  padding: 0.5rem;
  gap: 5px;
  width: 125px;
  background-color: #fff;
`;

const DigitPicker = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 1rem;
  font-weight: 600;
  padding: 0;
  margin: 0;
  text-align: center;
  width: 60px;

  /* turn off text selection */
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* supported by Chrome, Opera and Firefox */
`;

const ArrowPicker = styled("div")`
  display: flex;
  flex-direction: column;
  border: none;
  outline: none;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  font-size: 1.1rem;
  font-weight: 600;
  color: #000;
  padding: 0;
  margin: 0;
  text-align: center;
  width: 100%;
  cursor: pointer;
  color: #1d9bf0 !important;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #a3a3a3 !important;
  }
`;

const DigitDropDown = styled("select")`
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 0.8rem;
  font-weight: 500;
  color: #000;
  padding: 0;
  margin: 0;
  text-align: center;
  width: 100%;
  cursor: pointer;
  /* color: #1d9bf0; */

  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: "";

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const DigitDropDownItem = styled("option")`
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 1rem;
  font-weight: 500;
  color: #000;
  padding: 0;
  margin: 0;
  text-align: center;
  width: 100%;
`;

const DatePickerContainer = styled("div")`
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  background-color: aliceblue;
  border-radius: 2px;
  border: 1px solid #ccc;
  padding: 0.5rem;
  gap: 15px;
  width: 125px;
  background-color: #fff;
`;

const DateInput = styled("input")`
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 0.8rem;
  font-weight: 600;
  color: #000;
  padding: 0;
  margin: 0;
  text-align: center;
  cursor: pointer;
  /* color: #1d9bf0 !important; */
`;
