"use client";
import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";

const Index = dynamic(
  () => {
    return import("./Index");
  },
  { ssr: false }
);

const Trash = () => {
  return (
    <>
      {/* <!-- Content header --> */}

      <div className="grid grid-cols-1 p-4">
        <div className="w-full px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex gap-3 md:flex-row items-center">
              <div className="relative w-full px-4 max-w-full text-center md:text-left flex-grow flex-1">
                <h3 className="font-semibold text-base">Trash List</h3>
              </div>
              <div className="relative w-full px-4 max-w-full items-center flex-grow flex-1 text-center md:text-right">
                <Link
                  href="/controls"
                  className="bg-primary space-x-1 hover:bg-primary-dark text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  <span className="w-4 inline-flex align-middle">
                    <ChevronDoubleLeftIcon className="w-5 h-5" />
                  </span>
                  <span className="inline-flex align-middle">back</span>
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

export default Trash;
