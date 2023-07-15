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

const logFilter = {
  0: "log",
  1: "log/this-week",
  2: "log/this-month",
  3: "log/model/auth",
  4: "log/user/1",
  5: "log/multiple-filters",
};

const Index = ({ filter }) => {
  console.log(logFilter[filter]);
  const token = Cookies.get("AT");
  useUpdateEffect(() => {
    //initialize datatable
    $("#logs_index").DataTable({
      ajax: {
        url: `https://lets-comply-backend.auguma.io/admin/${logFilter[filter]}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      search: { smart: true },
      processing: true,
      serverSide: true,
      columns: [
        // colum names..
        { data: "user", searchable: true, orderable: true },
        { data: "model", searchable: true, orderable: true },
        { data: "type", searchable: true, orderable: true },
        { data: "action", searchable: true, orderable: true },
        { data: "created_at", searchable: true, orderable: true },
      ],
      columnDefs: [
        // difinition and styling
      ],
    });
  }, []);

  useUpdateEffect(() => {
    $("#logs_index")
      .DataTable()
      .ajax.url(
        `https://lets-comply-backend.auguma.io/admin/${logFilter[filter]}`
      )
      .load();
  }, [filter]);
  return (
    <table id="logs_index" className="display compact pt-3">
      <thead className="bg-primary text-white">
        <tr>
          <th className="text-center">User</th>
          <th>model</th>
          <th className="self-center">Type</th>
          <th className="text-center">Action</th>
          <th>Created At</th>
        </tr>
      </thead>
    </table>
  );
};

export default Index;
