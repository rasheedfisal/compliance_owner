"use client";
import React from "react";
import { createRoot } from "react-dom/client";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import DataTable from "datatables.net-dt";

//Bootstrap and jQuery libraries
// import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-responsive/js/dataTables.responsive";

import $ from "jquery";
import Cookies from "js-cookie";
import useUpdateEffect from "@/hooks/useUpdateEffect";

const logFilter = {
  0: "log",
  1: "log/this-week",
  2: "log/this-month",
  3: "log/model",
  4: "log/user",
  5: "log/multiple-filters",
};

const Index = ({ filter, model, datefrom, dateto, userId }) => {
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
      responsive: true,
      autoWidth: false,
      order: [1, "asc"],

      search: { smart: true },
      processing: true,
      serverSide: true,
      columns: [
        // colum names..
        { data: "user", searchable: true, orderable: true },
        { data: "model", searchable: true, orderable: true },
        { data: "type", searchable: true, orderable: true },
        { data: "created_at", searchable: true, orderable: true },
        { data: "action", searchable: true, orderable: true },
      ],
      columnDefs: [
        // difinition and styling
      ],
    });
  }, []);

  useUpdateEffect(() => {
    if (filter === 3) {
      if (model !== "all") {
        $("#logs_index")
          .DataTable()
          .ajax.url(
            `https://lets-comply-backend.auguma.io/admin/${logFilter[filter]}/${model}`
          )
          .load();
      }
    } else if (filter === 4) {
      if (userId !== 0) {
        $("#logs_index")
          .DataTable()
          .ajax.url(
            `https://lets-comply-backend.auguma.io/admin/${logFilter[filter]}/${userId}`
          )
          .load();
      }
    } else if (filter === 5) {
      $("#logs_index")
        .DataTable()
        .ajax.url(
          `https://lets-comply-backend.auguma.io/admin/${logFilter[filter]}?user_id=&from=${datefrom}&to=${dateto}&model=${model}`
        )
        .load();
    } else {
      $("#logs_index")
        .DataTable()
        .ajax.url(
          `https://lets-comply-backend.auguma.io/admin/${logFilter[filter]}`
        )
        .load();
    }
  }, [filter, model, dateto, userId]);
  return (
    <table id="logs_index" className="display compact pt-3">
      <thead className="bg-primary text-white">
        <tr>
          <th className="text-center">User</th>
          <th>model</th>
          <th className="self-center">Type</th>
          <th>Created At</th>
          <th className="text-center">Action</th>
        </tr>
      </thead>
    </table>
  );
};

export default Index;
