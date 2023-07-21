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
import { restoreRegulatorFn, deleteRegulatorFn } from "@/api/regulatorApi";
import { BASE_URL } from "@/api/axios";

const Index = () => {
  const token = Cookies.get("AT");
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    mutate: restoreRegulator,
  } = useMutation(({ id }) => restoreRegulatorFn({ id }), {
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries(["trashed-regulators-count"]);
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
    mutate: deleteRegulator,
  } = useMutation(({ id }) => deleteRegulatorFn({ id }), {
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries(["trashed-regulators-count"]);
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
    $("#regulators_trash_index").DataTable({
      ajax: {
        url: `${BASE_URL}/admin/regulators/trashed`,
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
        { data: "email_domain", searchable: true, orderable: true },
        { data: "staff", searchable: true, orderable: true },
        { data: "assesments", searchable: true, orderable: true },
        { data: "created_at", searchable: true, orderable: true },

        { data: "actions", searchable: false, orderable: false },
      ],
      columnDefs: [
        // difinition and styling
        //{ targets: [0, 5] },
        // { className: "text-center", targets: [1, 2] },
        {
          targets: [0],
          createdCell: (td, cellData, rowData) =>
            createRoot(td).render(
              <div className="flex items-center text-sm">
                <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                  <img
                    className="object-cover w-full h-full rounded-full"
                    src={rowData.logo ?? "noImg.jpg"}
                    alt="avatar"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 rounded-full shadow-inner"
                    aria-hidden="true"
                  ></div>
                </div>
                <div>
                  <p className="font-semibold">{rowData.name}</p>
                </div>
              </div>
            ),
        },
        {
          targets: [5],
          createdCell: (td, cellData, rowData) =>
            createRoot(td).render(
              <div className="flex">
                <button
                  className="bg-blue-700 space-x-1 hover:bg-blue-600 text-white focus:outline-none focus:ring focus:ring-blue-700 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer"
                  onClick={() => restoreRegulator({ id: rowData.id })}
                >
                  <span className="w-4 inline-flex align-middle">
                    <UploadIcon />
                  </span>
                  <span>Restore</span>
                </button>
                <button
                  className="bg-red-700 space-x-1 hover:bg-red-600 text-white focus:outline-none focus:ring focus:ring-red-700 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer"
                  onClick={() => deleteRegulator({ id: rowData.id })}
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
    $("#regulators_trash_index").DataTable().ajax.reload();
  }, [isSuccess, isDeletedSuccess]);
  return (
    <table id="regulators_trash_index" className="display compact pt-3">
      <thead className="bg-primary text-white">
        <tr>
          <th>Name</th>
          <th className="self-center">Email</th>
          <th className="text-center">Staff</th>
          <th className="text-center">Assessment</th>
          <th>Created At</th>
          <th></th>
        </tr>
      </thead>
    </table>
  );
};

export default Index;
