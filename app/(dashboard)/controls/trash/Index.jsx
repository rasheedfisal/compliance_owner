"use client";
import React from "react";
import { createRoot } from "react-dom/client";

//Bootstrap and jQuery libraries
// import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";

// //Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
// import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import Cookies from "js-cookie";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import UploadIcon from "@/icons/UploadIcon";
import DeleteIcon from "@/icons/DeleteIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { restoreControlsFn, deleteControlsFn } from "@/api/controlsApi";
import { BASE_URL } from "@/api/axios";

const Index = () => {
  const token = Cookies.get("AT");
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    mutate: restoreControls,
  } = useMutation(({ id }) => restoreControlsFn({ id }), {
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries(["trashed-controls-count"]);
    },
    onError: (error) => {
      if (error.response?.data.message) {
        toast.error(error.response?.data.message, {
          position: "top-right",
        });
        error.response?.data.data.map((msg) =>
          toast.error(msg, {
            position: "top-right",
          })
        );
      }
    },
  });

  const {
    isLoading: isDeleting,
    isSuccess: isDeletedSuccess,
    mutate: deleteControls,
  } = useMutation(({ id }) => deleteControlsFn({ id }), {
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries(["trashed-controls-count"]);
    },
    onError: (error) => {
      if (error.response?.data.message) {
        toast.error(error.response?.data.message, {
          position: "top-right",
        });
        error.response?.data.data.map((msg) =>
          toast.error(msg, {
            position: "top-right",
          })
        );
      }
    },
  });

  useUpdateEffect(() => {
    //initialize datatable
    $("#controls_trash_index").DataTable({
      ajax: {
        url: `${BASE_URL}/admin/controls/trashed`,
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
        { data: "sub-domain", searchable: true, orderable: true },
        { data: "assesments", searchable: true, orderable: true },
        { data: "created_at", searchable: true, orderable: true },

        { data: "actions", searchable: false, orderable: false },
      ],
      columnDefs: [
        // difinition and styling
        //{ targets: [0, 5] },
        // { className: "text-center", targets: [1, 2] },
        {
          targets: [5],
          createdCell: (td, cellData, rowData) =>
            createRoot(td).render(
              <div className="flex">
                <button
                  className="bg-blue-700 space-x-1 hover:bg-blue-600 text-white focus:outline-none focus:ring focus:ring-blue-700 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer"
                  onClick={() => restoreControls({ id: rowData.id })}
                >
                  <span className="w-4 inline-flex align-middle">
                    <UploadIcon />
                  </span>
                  <span>Restore</span>
                </button>
                <button
                  className="bg-red-700 space-x-1 hover:bg-red-600 text-white focus:outline-none focus:ring focus:ring-red-700 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer"
                  onClick={() => deleteControls({ id: rowData.id })}
                >
                  <span className="w-4 inline-flex align-middle">
                    <DeleteIcon />
                  </span>
                  <span>Delete</span>
                </button>
              </div>
            ),
        },
      ],
    });
  }, []);
  useUpdateEffect(() => {
    //initialize datatable
    $("#controls_trash_index").DataTable().ajax.reload();
  }, [isSuccess, isDeletedSuccess]);
  return (
    <table id="controls_trash_index" className="display compact pt-3">
      <thead className="bg-primary text-white">
        <tr>
          <th>Name</th>
          <th className="self-center">Code</th>
          <th className="text-center">Sub Domain</th>
          <th className="text-center">Assessment</th>
          <th>Created At</th>
          <th></th>
        </tr>
      </thead>
    </table>
  );
};

export default Index;
