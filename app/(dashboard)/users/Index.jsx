"use client";
import React from "react";
import { createRoot } from "react-dom/client";

//Bootstrap and jQuery libraries
// import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";

import $ from "jquery";
import Cookies from "js-cookie";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/api/axios";
import SearchIcon from "@/icons/SearchIcon";
import VerfiedBadge from "@/components/VerfiedBadge";

const Index = () => {
  const token = Cookies.get("AT");
  const router = useRouter();
  // $(function () {
  // Client-side-only code
  //   if (typeof window === "undefined") {
  //     return <p>loading...</p>;
  //   }

  // });
  useUpdateEffect(() => {
    //initialize datatable
    $("#users_index").DataTable({
      ajax: {
        url: `${BASE_URL}/admin/users`,
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
        { data: "email", searchable: true, orderable: true },
        { data: "role", searchable: true, orderable: true },
        { data: "email_verified_at", searchable: true, orderable: true },
        { data: "created_at", searchable: true, orderable: true },

        {
          data: "actions",
          searchable: false,
          orderable: false,
          defaultContent: "",
        },
      ],
      columnDefs: [
        {
          targets: [3],
          createdCell: (td, cellData, rowData) =>
            createRoot(td).render(
              <div className="flex">
                <VerfiedBadge verfiedDate={cellData} />
              </div>
            ),
        },
        {
          targets: [5],
          createdCell: (td, cellData, rowData) =>
            createRoot(td).render(
              <div className="flex">
                <button
                  className="w-4 mr-2 mt-1 transform rounded-md text-blue-700 hover:scale-110"
                  title="show"
                  onClick={() => router.push(`/users/show/${rowData.id}`)}
                >
                  <SearchIcon />
                </button>
              </div>
            ),
        },
      ],
    });
  }, []);
  return (
    <table id="users_index" className="display compact pt-3">
      <thead className="bg-primary text-white">
        <tr>
          <th>Name</th>
          <th className="self-center">Email</th>
          <th className="self-center">Role</th>
          <th className="self-center">Status</th>
          <th>Created At</th>
          <th></th>
        </tr>
      </thead>
    </table>
  );
};

export default Index;
