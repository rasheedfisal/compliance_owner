"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { TypeOf, object, string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDoubleLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import FormInputShow from "@/components/FormInputShow";
import { useRouter } from "next/navigation";
import {
  getOrganizationFn,
  moveOrganizationToTrashFn,
} from "@/api/organizationApi";
import TrashedButton from "@/components/TrashedButton";
import Link from "next/link";
import FormShowFile from "@/components/FormShowFile";

type PageProps = {
  params: {
    DId: string;
  };
};

const showOrgSchema = object({
  name: string().optional(),
  email_domain: string().optional(),
  code: string().optional(),
  type: string().optional(),
  logo: string().optional(),
}).partial();

type IShowOrg = TypeOf<typeof showOrgSchema>;

const Show = ({ params: { DId } }: PageProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isLoading: isOrgLoading, data: getOrg } = useQuery(
    ["org", DId],
    () => getOrganizationFn(DId),
    {
      select: (data) => data,
      retry: 1,
      onSuccess: ({ error, data }) => {
        if (!error) {
          methods.reset({
            name: data.name,
            email_domain: data.email_domain,
            code: data.code,
            type: data.type,
          });
        }
      },
      onError: (error) => {
        if ((error as any).response?.data.message) {
          toast.error((error as any).response?.data.message, {
            position: "top-right",
          });
        }
      },
    }
  );

  const { isLoading, mutate: moveOrgToTrash } = useMutation(
    ({ id }: { id: string }) => moveOrganizationToTrashFn({ id }),
    {
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries(["trashed-org-count"]);
        toast.success(message);
        router.push("/organizations");
      },
      onError: (error: any) => {
        if ((error as any).response?.data?.message) {
          toast.error((error as any).response?.data?.message, {
            position: "top-right",
          });

          (error as any).response?.data.data.map((msg: string) =>
            toast.error(msg, {
              position: "top-right",
            })
          );
        }
      },
    }
  );

  const methods = useForm<IShowOrg>({
    resolver: zodResolver(showOrgSchema),
  });

  if (isOrgLoading) {
    return <p>Loading...</p>;
  }

  const onSubmitHandler: SubmitHandler<IShowOrg> = (values) => {
    moveOrgToTrash({ id: DId });
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-end px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <Link
          href="/organizations"
          className="px-4 py-2 flex items-center text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
        >
          <ChevronDoubleLeftIcon className="w-5 h-5" />
          Back
        </Link>
      </div>
      <div className="grid grid-cols-1 p-4">
        <div className="w-full relative px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <FormProvider {...methods}>
            <form
              className="space-y-6"
              noValidate
              autoComplete="off"
              onSubmit={methods.handleSubmit(onSubmitHandler)}
            >
              <div className="grid grid-cols-1">
                <FormInputShow label="Name" type="text" name="name" />
              </div>
              <div className="grid grid-cols-1">
                <FormInputShow label="Email" type="email" name="email_domain" />
              </div>
              <div className="grid grid-cols-1">
                <FormInputShow label="Code" type="text" name="code" />
              </div>
              <div className="grid grid-cols-1">
                <FormInputShow label="Type" type="text" name="type" />
              </div>
              <div className="grid grid-cols-1">
                <FormShowFile
                  name="logo"
                  multiple={false}
                  label=""
                  defaultUrl={getOrg?.data.logo}
                />
              </div>
              <div>
                <TrashedButton
                  title="Move To Trash"
                  clicked={isLoading}
                  loadingTitle="loading..."
                  icon={<TrashIcon className="h-5 w-5" />}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default Show;
