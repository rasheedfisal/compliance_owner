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
import { getDominFn, moveDomainToTrashFn } from "@/api/domainApi";
import { ICreateUpdateDomain } from "@/typings";
import TrashedButton from "@/components/TrashedButton";
import Link from "next/link";

type PageProps = {
  params: {
    DId: string;
  };
};

const updateDomainSchema = object({
  name: string().min(1, "Name is required"),
  code: z
    .string()
    .min(1, "Code is Required")
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
});

const Show = ({ params: { DId } }: PageProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isLoading: isDomainLoading } = useQuery(
    ["domains", DId],
    () => getDominFn(DId),
    {
      select: (data) => data,
      retry: 1,
      onSuccess: ({ error, data }) => {
        if (!error) {
          methods.reset({
            name: data.name,
            code: data.code.toString(),
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

  const { isLoading, mutate: moveDomainToTrash } = useMutation(
    ({ id }: { id: string }) => moveDomainToTrashFn({ id }),
    {
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries(["trashed-domains-count"]);
        toast.success(message);
        router.push("/domains");
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

  const methods = useForm<ICreateUpdateDomain>({
    resolver: zodResolver(updateDomainSchema),
  });

  if (isDomainLoading) {
    return <p>Loading...</p>;
  }

  const onSubmitHandler: SubmitHandler<ICreateUpdateDomain> = (values) => {
    moveDomainToTrash({ id: DId });
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-end px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <Link
          href="/domains"
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
