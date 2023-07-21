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
import EditIcon from "@/icons/EditIcon";
import SearchIcon from "@/icons/SearchIcon";
import { BASE_URL } from "@/api/axios";

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
    $("#subdomain_index").DataTable({
      ajax: {
        url: `${BASE_URL}/admin/sub-domains`,
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
        { data: "domain", searchable: true, orderable: true },
        { data: "created_at", searchable: true, orderable: true },

        { data: "actions", searchable: false, orderable: false },
      ],
      columnDefs: [
        // difinition and styling
        //{ targets: [0, 5] },
        // { className: "text-center", targets: [1, 2] },
        {
          targets: [4],
          createdCell: (td, cellData, rowData) =>
            createRoot(td).render(
              <div className="flex">
                <button
                  className="w-4 mr-2 mt-1 transform rounded-md text-blue-700 hover:scale-110"
                  title="show"
                  onClick={() => router.push(`/subdomains/show/${rowData.id}`)}
                >
                  <SearchIcon />
                </button>
                <button
                  className="w-4 mr-2 mt-1 transform rounded-md text-yellow-700 hover:scale-110"
                  title="edit"
                  onClick={() => router.push(`/subdomains/${rowData.id}`)}
                >
                  <EditIcon />
                </button>
              </div>
            ),
        },
      ],
    });
  }, []);
  return (
    <table id="subdomain_index" className="display compact pt-3">
      <thead className="bg-primary text-white">
        <tr>
          <th>Name</th>
          <th className="self-center">Code</th>
          <th className="text-center">Domain</th>
          <th>Created At</th>
          <th></th>
        </tr>
      </thead>
    </table>
  );
};

export default Index;
