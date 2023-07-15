"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  UserIcon,
  CalendarDaysIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/solid";
import RadioGroup from "@/components/RadioGroup";
const Index = dynamic(
  () => {
    return import("./Index");
  },
  { ssr: false }
);

const Manage = () => {
  const [filter, setFilter] = useState(0);
  return (
    <div className="grid grid-cols-1 p-4">
      <div className="w-full px-4 py-6 bg-white rounded-md dark:bg-darker">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-col gap-3 md:flex-row items-center">
            <div className="relative w-full px-4 max-w-full text-center md:text-left flex-grow flex-1">
              <h3 className="font-semibold text-base">Log List</h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <div className="mb-3">
            <RadioGroup
              onChange={(option) => setFilter(option)}
              options={[
                <div className="flex flex-1 justify-around">
                  <span>All</span>
                  <FunnelIcon className="w-4" />
                </div>,
                <div className="flex  flex-1 justify-around">
                  <span>This Week</span>
                  <CalendarDaysIcon className="w-4" />
                </div>,
                <div className="flex  flex-1 justify-around">
                  <span>This Month</span>
                  <CalendarDaysIcon className="w-4" />
                </div>,
                <div className="flex  flex-1 justify-around">
                  <span>By Model</span>
                  <AdjustmentsHorizontalIcon className="w-4" />
                </div>,
                <div className="flex  flex-1 justify-around">
                  <span>By User</span>
                  <UserIcon className="w-4" />
                </div>,
                <div className="flex  flex-1 justify-around">
                  <span>Multiple</span>
                  <AdjustmentsHorizontalIcon className="w-4" />
                </div>,
              ]}
            />
          </div>
          <div class="table-responsive">
            <Index filter={filter} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;
