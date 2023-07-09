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
import useUpdateEffect from "@/hooks/useUpdateEffect";

const Index = () => {
  const token = Cookies.get("AT");
  // $(function () {
  // Client-side-only code
  //   if (typeof window === "undefined") {
  //     return <p>loading...</p>;
  //   }

  // });
  useUpdateEffect(() => {
    //initialize datatable
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
        { data: "updated_at", searchable: true, orderable: true },
        { data: "sub-domains", searchable: true, orderable: true },
        // { data: "actions", searchable: false, orderable: false },
      ],
      columnDefs: [
        // difinition and styling
        { targets: [0, 4] },
        // { className: "text-center", targets: [0, 2] },
      ],
    });
  }, []);
  // className="p-8 text-xs text-gray-500"
  // className="p-8 text-xs text-gray-500"
  // className="p-8 text-xs text-gray-500"
  // className="p-8 text-xs text-gray-500"
  // className="p-8 text-xs text-gray-500"
  return (
    <table id="domain_index" className="display compact mt-3">
      <thead className="bg-primary text-white">
        <tr>
          <th>Name</th>
          <th>Code</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th>Sub-Domain</th>
        </tr>
      </thead>
    </table>
  );
};

export default Index;
