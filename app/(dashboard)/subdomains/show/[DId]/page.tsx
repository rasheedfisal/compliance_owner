"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDoubleLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import FormInputShow from "@/components/FormInputShow";
import { useRouter } from "next/navigation";
import { getSubDominFn, moveSubDomainToTrashFn } from "@/api/subDomainApi";
import { ICreateUpdateSubDomain } from "@/typings";
import TrashedButton from "@/components/TrashedButton";
import Link from "next/link";

type PageProps = {
  params: {
    DId: string;
  };
};

const updateSubDomainSchema = object({
  name: string().min(1, "Name is required"),
  code: z
    .string()
    .min(1, "Code is Required")
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  domain_id: string().min(1),
});

const Show = ({ params: { DId } }: PageProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isLoading: isSubDomainLoading } = useQuery(
    ["sub-domains", DId],
    () => getSubDominFn(DId),
    {
      select: (data) => data,
      retry: 1,
      onSuccess: ({ error, data }) => {
        if (!error) {
          methods.reset({
            name: data.name,
            code: data.code.toString(),
            domain_id: data.domain_id.toString(),
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

  const { isLoading, mutate: moveSubDomainToTrash } = useMutation(
    ({ id }: { id: string }) => moveSubDomainToTrashFn({ id }),
    {
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries(["trashed-sub-domains-count"]);
        toast.success(message);
        router.push("/subdomains");
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

  const methods = useForm<ICreateUpdateSubDomain>({
    resolver: zodResolver(updateSubDomainSchema),
  });

  if (isSubDomainLoading) {
    return <p>Loading...</p>;
  }

  const onSubmitHandler: SubmitHandler<ICreateUpdateSubDomain> = (values) => {
    moveSubDomainToTrash({ id: DId });
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-end px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <Link
          href="/subdomains"
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
                <FormInputShow label="Code" type="text" name="code" />
              </div>
              <div className="grid grid-cols-1">
                <FormInputShow label="Domain ID" type="text" name="domain_id" />
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
