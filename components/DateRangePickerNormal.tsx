import { Dispatch, SetStateAction, useRef, useState } from "react";
import { DateRange, Range } from "react-date-range";
import useUpdateEffect from "@/hooks/useUpdateEffect";

import format from "date-fns/format";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { assertIsNode } from "@/utility/helpers";

type ComponentProps = {
  setRange: Dispatch<SetStateAction<Range[]>>;
  range: Range[];
};

const DateRangePickerNormal = ({ range, setRange }: ComponentProps) => {
  // date state
  // const [range, setRange] = useState<Range[]>([
  //   {
  //     startDate: new Date(),
  //     endDate: addDays(new Date(), 7),
  //     key: "selection",
  //   },
  // ]);

  // open close
  const [open, setOpen] = useState(false);

  // get the target element to toggle
  const refOne = useRef<HTMLDivElement>(null);

  useUpdateEffect(() => {
    // event listeners
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  // hide dropdown on ESC press
  const hideOnEscape = (e: KeyboardEvent) => {
    // console.log(e.key)
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Hide on outside click
  const hideOnClickOutside = ({ target }: MouseEvent) => {
    // console.log(refOne.current)
    // console.log(e.target)
    assertIsNode(target);
    if (refOne.current && !refOne.current.contains(target)) {
      setOpen(false);
    }
  };

  return (
    <div className="calendarWrap">
      <input
        value={`${format(
          range[0].startDate ?? new Date(),
          "MM/dd/yyyy"
        )} - ${format(range[0].endDate ?? new Date(), "MM/dd/yyyy")}`}
        readOnly
        className="px-4 py-2 border border-gray-400 rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
        onClick={() => setOpen((open) => !open)}
      />

      <div ref={refOne}>
        {open && (
          <DateRange
            onChange={(item) => setRange([item.selection])}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={1}
            direction="horizontal"
            className="calendarElement"
          />
        )}
      </div>
    </div>
  );
};

export default DateRangePickerNormal;
