"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SubmitButton from "@/components/SubmitButton";
import {
  ChevronDoubleLeftIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid";
import FormInput from "@/components/FormInput";
import { useRouter } from "next/navigation";
import { getSubDominFn, updateSubDomainFn } from "@/api/subDomainApi";
import { getAllDominFn } from "@/api/domainApi";
import { ICreateUpdateSubDomain } from "@/typings";
import FormSelect from "@/components/FormSelect";
import Link from "next/link";
import { IUpsertSubDomain } from "../add/page";

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
  domain: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

const Edit = ({ params: { DId } }: PageProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    isLoading: isDomainLoading,
    isSuccess,
    data: domains,
  } = useQuery(["domains"], () => getAllDominFn(), {
    select: (data) => data,
    retry: 1,
    onError: (error) => {
      if ((error as any).response?.data?.msg) {
        toast.error((error as any).response?.data?.msg, {
          position: "top-right",
        });
      }
    },
  });

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
            domain: {
              value: data.domain_id.toString(),
            },
          });
        }
      },
      onError: (error) => {
        console.log(error);
        if ((error as any).response?.data.message) {
          toast.error((error as any).response?.data.message, {
            position: "top-right",
          });
        }
      },
    }
  );

  const { isLoading, mutate: updateSubDomin } = useMutation(
    ({ id, subdomain }: { id: string; subdomain: ICreateUpdateSubDomain }) =>
      updateSubDomainFn({ id, subdomain }),
    {
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries(["sub-domains"]);
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

  const methods = useForm<IUpsertSubDomain>({
    resolver: zodResolver(updateSubDomainSchema),
  });

  if (isSubDomainLoading) {
    return <p>Loading...</p>;
  }

  const onSubmitHandler: SubmitHandler<IUpsertSubDomain> = (values) => {
    updateSubDomin({
      id: DId,
      subdomain: {
        name: values.name,
        code: values.code,
        domain_id: values.domain.value,
      },
    });
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
                <FormInput label="Name" type="text" name="name" />
              </div>
              <div className="grid grid-cols-1">
                <FormInput label="Code" type="text" name="code" />
              </div>
              <div className="grid grid-cols-1">
                <FormSelect
                  label="Domains"
                  name="domain"
                  isLoading={isDomainLoading}
                  data={
                    isSuccess
                      ? domains.data.map(({ id, name }) => ({
                          value: id.toString(),
                          label: name,
                        }))
                      : []
                  }
                  isMulti={false}
                  isRtl={false}
                />
              </div>
              <div className="flex">
                <SubmitButton
                  title="Submit"
                  clicked={isLoading}
                  loadingTitle="loading..."
                  icon={<DocumentPlusIcon className="h-5 w-5" />}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default Edit;
