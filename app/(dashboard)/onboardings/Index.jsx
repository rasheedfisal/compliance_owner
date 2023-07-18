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
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteOnboardingFn } from "@/api/onboardingsApi";
import CompletedBadge from "@/components/CompletedBadge";

const Index = () => {
  const token = Cookies.get("AT");

  const { isSuccess: isDeletedSuccess, mutate: deleteOnboarding } = useMutation(
    ({ id }) => deleteOnboardingFn({ id }),
    {
      onSuccess: ({ message }) => {
        toast.success(message);
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
    }
  );

  useUpdateEffect(() => {
    //initialize datatable
    $("#onboardings_index").DataTable({
      ajax: {
        url: "https://lets-comply-backend.auguma.io/admin/onboardings",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      search: { smart: true },
      processing: true,
      serverSide: true,
      columns: [
        // colum names..
        { data: "regulator", searchable: true, orderable: true },
        { data: "organization", searchable: true, orderable: true },
        { data: "email", searchable: true, orderable: true },
        { data: "created_at", searchable: true, orderable: true },
        { data: "is_complete", searchable: true, orderable: true },

        {
          data: "actions",
          searchable: false,
          orderable: false,
          defaultContent: "",
        },
      ],
      columnDefs: [
        // difinition and styling
        //{ targets: [0, 5] },
        // { className: "text-center", targets: [1, 2] },
        {
          targets: [4],
          createdCell: (td, cellData, rowData) =>
            createRoot(td).render(
              <div className="flex items-center">
                <CompletedBadge isComplete={rowData.is_complete} />
              </div>
            ),
        },
        {
          targets: [5],
          createdCell: (td, cellData, rowData) =>
            createRoot(td).render(
              <div className="flex">
                {rowData.is_complete && (
                  <button
                    className="bg-red-700 space-x-1 hover:bg-red-600 text-white focus:outline-none focus:ring focus:ring-red-700 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer"
                    onClick={() => deleteOnboarding({ id: rowData.id })}
                  >
                    <span className="w-4 inline-flex align-middle">
                      <DeleteIcon />
                    </span>
                    <span>Delete</span>
                  </button>
                )}
              </div>
            ),
        },
      ],
    });
  }, []);
  useUpdateEffect(() => {
    //initialize datatable
    $("#onboardings_index").DataTable().ajax.reload();
  }, [isDeletedSuccess]);
  return (
    <table id="onboardings_index" className="display compact pt-3">
      <thead className="bg-primary text-white">
        <tr>
          <th>regulator</th>
          <th className="self-center">organization</th>
          <th className="text-center">email</th>
          <th>Created At</th>
          <th className="text-center">Status</th>
          <th></th>
        </tr>
      </thead>
    </table>
  );
};

export default Index;
