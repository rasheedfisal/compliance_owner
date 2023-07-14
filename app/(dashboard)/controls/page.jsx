"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getTrashedControlsCountFn } from "@/api/controlsApi";
import { toast } from "react-toastify";
import DeleteIcon from "@/icons/DeleteIcon";
import CreateIcon from "@/icons/CreateIcon";
import { useRouter } from "next/navigation";
const Index = dynamic(
  () => {
    return import("./Index");
  },
  { ssr: false }
);

const Manage = () => {
  const router = useRouter();
  const [trashed, setTrashed] = useState(0);
  const { isLoading: isControlsLoading } = useQuery(
    ["trashed-controls-count"],
    () => getTrashedControlsCountFn(),
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

      <div className="grid grid-cols-1 p-4">
        <div className="w-full px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-col gap-3 md:flex-row items-center">
              <div className="relative w-full px-4 max-w-full text-center md:text-left flex-grow flex-1">
                <h3 className="font-semibold text-base">Controls List</h3>
              </div>
              <div className="relative w-full px-4 max-w-full items-center flex-grow flex-1 text-center md:text-right">
                <span className="bg-red-700 space-x-1 hover:bg-red-600 text-white focus:outline-none focus:ring focus:ring-red-700 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer">
                  <span className="w-4 inline-flex align-middle">
                    <DeleteIcon />
                  </span>
                  <button
                    className="inline-flex align-middle"
                    onClick={() => router.push("/controls/trash")}
                  >
                    Trashed {"("} {isControlsLoading ? "..." : trashed} {")"}
                  </button>
                </span>

                <Link
                  href="/controls/add"
                  className="bg-primary space-x-1 hover:bg-primary-dark text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  <span className="w-4 inline-flex align-middle">
                    <CreateIcon />
                  </span>
                  <span className="inline-flex align-middle">Create</span>
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

export default Manage;
