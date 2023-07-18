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
import DateRangePicker from "@/components/DateRangePickerAdvance";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getModelsFn, getUsersFn } from "@/api/selectablesApi";
import Select from "react-select";
import { AnimatePresence, motion } from "framer-motion";
import { addDays } from "date-fns";
import { Range } from "react-date-range";
const Index = dynamic(
  () => {
    return import("./Index");
  },
  { ssr: false }
);

const Manage = () => {
  const [filter, setFilter] = useState(0);
  const [model, setModel] = useState("all");
  const [userId, setUserId] = useState(0);
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const {
    isLoading: isModelLoading,
    isSuccess,
    data: models,
  } = useQuery(["models"], () => getModelsFn(), {
    select: (data) => data,
    retry: 1,
    enabled: filter === 3 || filter === 5,
    onSuccess(data) {
      console.log(data.data);
    },
    onError: (error) => {
      if ((error as any).response?.data?.msg) {
        toast.error((error as any).response?.data?.msg, {
          position: "top-right",
        });
      }
    },
  });

  const {
    isLoading: isUsersLoading,
    isSuccess: isUserSuccess,
    data: users,
  } = useQuery(["users-list"], () => getUsersFn(), {
    select: (data) => data,
    retry: 1,
    enabled: filter === 4 || filter === 5,
    onSuccess(data) {
      console.log(data.data);
    },
    onError: (error) => {
      if ((error as any).response?.data?.msg) {
        toast.error((error as any).response?.data?.msg, {
          position: "top-right",
        });
      }
    },
  });

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
        <div className="block">
          <div className="mb-3">
            <RadioGroup
              onChange={(option) => setFilter(option)}
              options={[
                <div key={0} className="flex flex-1 justify-around">
                  <span>All</span>
                  <FunnelIcon className="w-4" />
                </div>,
                <div key={1} className="flex  flex-1 justify-around">
                  <span>This Week</span>
                  <CalendarDaysIcon className="w-4" />
                </div>,
                <div key={2} className="flex  flex-1 justify-around">
                  <span>This Month</span>
                  <CalendarDaysIcon className="w-4" />
                </div>,
                <div key={3} className="flex  flex-1 justify-around">
                  <span>By Model</span>
                  <AdjustmentsHorizontalIcon className="w-4" />
                </div>,
                <div key={4} className="flex  flex-1 justify-around">
                  <span>By User</span>
                  <UserIcon className="w-4" />
                </div>,
                // <div key={5} className="flex  flex-1 justify-around">
                //   <span>Multiple</span>
                //   <AdjustmentsHorizontalIcon className="w-4" />
                // </div>,
              ]}
            />
          </div>
          <div className="mb-3 flex gap-3 justify-center">
            <AnimatePresence>
              {(filter === 3 || filter === 5) && (
                <motion.div
                  key={1}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      ease: "easeOut",
                      duration: 0.3,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    transition: {
                      ease: "easeIn",
                      duration: 0.2,
                    },
                  }}
                  className="flex flex-col"
                >
                  <span>Model</span>
                  <Select
                    classNames={{
                      control: () =>
                        "py-[.1rem] border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker",
                    }}
                    className="my-react-select-container"
                    classNamePrefix="my-react-select"
                    options={
                      isSuccess
                        ? models.data.map((item) => ({
                            value: item,
                            label: item,
                          }))
                        : []
                    }
                    onChange={(e) => setModel(e?.value ?? "all")}
                    isClearable={true}
                    isLoading={isModelLoading}
                  />
                </motion.div>
              )}

              {(filter === 4 || filter === 5) && (
                <motion.div
                  key={2}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      ease: "easeOut",
                      duration: 0.3,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    transition: {
                      ease: "easeIn",
                      duration: 0.2,
                    },
                  }}
                  className="flex flex-col"
                >
                  <span>Users</span>
                  <Select
                    classNames={{
                      control: () =>
                        "py-[.1rem] border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker",
                    }}
                    className="my-react-select-container"
                    classNamePrefix="my-react-select"
                    options={
                      isUserSuccess
                        ? users.data.map(({ id, name }) => ({
                            value: id,
                            label: name,
                          }))
                        : []
                    }
                    onChange={(e) => setUserId(e?.value ?? 0)}
                    isClearable={true}
                    isLoading={isUsersLoading}
                  />
                </motion.div>
              )}

              {/* {filter === 5 && (
                <motion.div
                  key={3}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      ease: "easeOut",
                      duration: 0.3,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    transition: {
                      ease: "easeIn",
                      duration: 0.2,
                    },
                  }}
                  className="flex flex-col relative"
                >
                  <span>Date Range</span>
                  <DateRangePicker range={range} setRange={setRange} />
                </motion.div>
              )} */}
            </AnimatePresence>
          </div>
          <div className="overflow-x-auto">
            <Index
              filter={filter}
              model={model}
              datefrom={range[0].startDate}
              dateto={range[0].endDate}
              userId={userId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;
