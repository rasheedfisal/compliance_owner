"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getTrashedDominFn } from "@/api/domainApi";
const Index = dynamic(
  () => {
    return import("./Index");
  },
  { ssr: false }
);

const page = () => {
  const [trashed, setTrashed] = useState(0);
  const { isLoading: isDomainLoading } = useQuery(
    ["trashed-domains"],
    () => getTrashedDominFn(),
    {
      select: (data) => data,
      retry: 1,
      onSuccess: ({ error, data }) => {
        if (!error) {
          setTrashed(data);
        }
      },
      onError: (error) => {
        if (error.response?.data.message) {
          toast.error(error.response?.data.message, {
            position: "top-right",
          });
        }
      },
    }
  );

  return (
    <>
      {/* <!-- Content header --> */}
      {/* <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-xl font-semibold">Manage Domains</h1>
      </div> */}
      <div className="grid grid-cols-1 p-4">
        <div className="w-full px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base">Domain List</h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <span className="bg-red-700 hover:bg-red-600 text-white focus:outline-none focus:ring focus:ring-red-700 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer">
                  Trashed {"("} {trashed} {")"}
                </span>
                <Link
                  href="/domains/add"
                  className="bg-primary hover:bg-primary-dark text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  Create
                </Link>
              </div>
            </div>
          </div>
          <div className="p-4 block w-full relative overflow-x-auto">
            <div className="relative">
              <Index />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
