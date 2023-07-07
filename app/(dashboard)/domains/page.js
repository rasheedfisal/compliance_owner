"use client";
import React from "react";
//Bootstrap and jQuery libraries
// import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import Cookies from "js-cookie";
import useUpdateEffect from "../../../hooks/useUpdateEffect";

const index = () => {
  const token = Cookies.get("AT");
  useUpdateEffect(() => {
    $("#domain_index").DataTable({
      ajax: {
        url: "https://lets-comply-backend.auguma.io/admin/domains",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      search: { smart: true },
      processing: true,
      serverSide: true,
      columns: [
        // colum names..
        { data: "name", searchable: true, orderable: true },
        { data: "code", searchable: true, orderable: true },
        { data: "created_at", searchable: true, orderable: true },
        // { data: "actions", searchable: false, orderable: false },
      ],
      columnDefs: [
        // difinition and styling
        { targets: [0, 2] },
        // { className: "text-center", targets: [0, 2] },
      ],
    });
  }, []);

  // $(function () {
  // Client-side-only code
  if (typeof window === "undefined") {
    return <p>loading...</p>;
  }

  // });
  //initialize datatable

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Manage Domains</h1>
      </div>
      <div className="grid grid-cols-1 p-4">
        <div className="w-full px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base">Domain List</h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <button className="bg-primary hover:bg-primary-dark text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                  Create
                </button>
              </div>
            </div>
          </div>
          <div className="block w-full relative overflow-x-auto">
            <div className="relative">
              <table id="domain_index">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Date</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
