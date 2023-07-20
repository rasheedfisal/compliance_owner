"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, z } from "zod";
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
import { getControlsFn, updateControlsFn } from "@/api/controlsApi";
import { getAllSubDominFn } from "@/api/subDomainApi";
import { ICreateUpdateControls } from "@/typings";
import FormSelect from "@/components/FormSelect";
import Link from "next/link";
import { IUpsertControls } from "../add/page";
import FormTextArea from "@/components/FormTextArea";

type PageProps = {
  params: {
    DId: string;
  };
};

const updateControlsSchema = object({
  name: string().min(1, "Name is required"),
  code: z
    .string()
    .min(1, "Code is Required")
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  subdomain: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

const Edit = ({ params: { DId } }: PageProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    isLoading: isSubDomainLoading,
    isSuccess,
    data: subdomains,
  } = useQuery(["sub-domains"], () => getAllSubDominFn(), {
    select: (data) => data,
    retry: 1,
    onError: (error) => {
      if ((error as any).response?.data?.message) {
        toast.error((error as any).response?.data?.message, {
          position: "top-right",
        });
      }
    },
  });

  const { isLoading: isControlsLoading } = useQuery(
    ["controls", DId],
    () => getControlsFn(DId),
    {
      select: (data) => data,
      retry: 1,
      onSuccess: ({ error, data }) => {
        if (!error) {
          methods.reset({
            name: data.name,
            code: data.code.toString(),
            subdomain: {
              value: data.sub_domain_id.toString(),
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

  const { isLoading, mutate: updateControls } = useMutation(
    ({ id, controls }: { id: string; controls: ICreateUpdateControls }) =>
      updateControlsFn({ id, controls }),
    {
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries(["controls"]);
        toast.success(message);
        router.push("/controls");
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

  const methods = useForm<IUpsertControls>({
    resolver: zodResolver(updateControlsSchema),
  });

  if (isControlsLoading) {
    return <p>Loading...</p>;
  }

  const onSubmitHandler: SubmitHandler<IUpsertControls> = (values) => {
    updateControls({
      id: DId,
      controls: {
        name: values.name,
        code: values.code,
        sub_domain_id: values.subdomain.value,
      },
    });
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-end px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <Link
          href="/controls"
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
                <FormSelect
                  label="Sub Domains"
                  name="subdomain"
                  isLoading={isSubDomainLoading}
                  data={
                    isSuccess
                      ? subdomains.data.map(({ id, name }) => ({
                          value: id.toString(),
                          label: name,
                        }))
                      : []
                  }
                  isMulti={false}
                  isRtl={false}
                />
              </div>
              <div className="grid grid-cols-1">
                <FormInput label="Control Code" type="text" name="code" />
              </div>
              <div className="grid grid-cols-1">
                <FormTextArea label="Control" rows={4} name="name" />
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
