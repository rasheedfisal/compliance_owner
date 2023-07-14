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
import { getRequlatorFn, updateRegulatorFn } from "@/api/regulatorApi";
import Link from "next/link";
import FileUpLoader from "@/components/FileUploader";
import { updateRegulatorSchema } from "@/schema/orgSchema";

type PageProps = {
  params: {
    DId: string;
  };
};

type IUpdateRegulator = TypeOf<typeof updateRegulatorSchema>;

const Edit = ({ params: { DId } }: PageProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isLoading: isRegulatorLoading, data: getRegulator } = useQuery(
    ["regulator", DId],
    () => getRequlatorFn(DId),
    {
      select: (data) => data,
      retry: 1,
      onSuccess: ({ error, data }) => {
        if (!error) {
          methods.reset({
            name: data.name,
            email_domain: data.email_domain,
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

  const { isLoading, mutate: updateRegulator } = useMutation(
    ({ id, formData }: { id: string; formData: FormData }) =>
      updateRegulatorFn({ id, formData }),
    {
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries(["regulators"]);
        toast.success(message);
        router.push("/regulators");
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

  const methods = useForm<IUpdateRegulator>({
    resolver: zodResolver(updateRegulatorSchema),
  });

  if (isRegulatorLoading) {
    return <p>Loading...</p>;
  }

  const onSubmitHandler: SubmitHandler<IUpdateRegulator> = (values) => {
    const formData = new FormData();

    formData.append("_method", "PUT");

    if (values.name !== undefined) {
      formData.append("name", values.name);
    }
    if (values.email_domain !== undefined) {
      formData.append("email_domain", values.email_domain);
    }
    if (values.logo !== undefined) {
      formData.append("logo", values.logo);
    }

    console.log(values);
    updateRegulator({ id: DId, formData });
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-end px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <Link
          href="/regulators"
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
                <FormInput label="Email" type="email" name="email_domain" />
              </div>
              <div className="flex flex-col items-center">
                <FileUpLoader
                  name="logo"
                  multiple={false}
                  label="select Logo"
                  defaultUrl={getRegulator?.data.logo}
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
