import { useRef, useState } from "react";
import { Calendar } from "react-date-range";
import format from "date-fns/format";
import useUpdateEffect from "@/hooks/useUpdateEffect";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { assertIsNode } from "@/utility/helpers";

const CalendarPicker = () => {
  // date state
  const [calendar, setCalendar] = useState("");

  // open close
  const [open, setOpen] = useState(false);

  // get the target element to toggle
  const refOne = useRef<HTMLDivElement>(null);

  useUpdateEffect(() => {
    // set current date on component load
    setCalendar(format(new Date(), "MM/dd/yyyy"));
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

  // on date change, store date in state
  const handleSelect = (date: Date) => {
    // console.log(date)
    // console.log(format(date, 'MM/dd/yyyy'))
    setCalendar(format(date, "MM/dd/yyyy"));
  };

  return (
    <div className="calendarWrap">
      <input
        value={calendar}
        readOnly
        className="px-4 py-2 border border-gray-400 rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
        onClick={() => setOpen((open) => !open)}
      />

      <div ref={refOne}>
        {open && (
          <Calendar
            date={new Date()}
            onChange={handleSelect}
            className="calendarElement"
          />
        )}
      </div>
    </div>
  );
};

export default CalendarPicker;
