"use client";

import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { TypeOf, object, string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import FormInput from "@/components/FormInput";
import SubmitButton from "@/components/SubmitButton";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import {
  createOrganizationFn,
  getAllOrganizationTypesFn,
} from "@/api/organizationApi";
import { useRouter } from "next/navigation";
import FileUpLoader from "@/components/FileUploader";
import FormSelect from "@/components/FormSelect";
import { createOrgSchema } from "@/schema/orgSchema";
import { useState } from "react";

export type ICreateOrg = TypeOf<typeof createOrgSchema>;

const Add = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    isLoading: isOrgTypeLoading,
    isSuccess,
    data: orgTypes,
  } = useQuery(["org-types"], () => getAllOrganizationTypesFn(), {
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

  const { isLoading, mutate: createOrg } = useMutation(
    (org: FormData) => createOrganizationFn(org),
    {
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries(["org"]);
        toast.success(message);
        router.push("/organizations");
      },
      onError: (error: any) => {
        if ((error as any).response?.data.message) {
          toast.error((error as any).response?.data.message, {
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

  const methods = useForm<ICreateOrg>({
    resolver: zodResolver(createOrgSchema),
  });
  const {
    formState: { isSubmitSuccessful },
  } = methods;

  useUpdateEffect(() => {
    if (isSubmitSuccessful) {
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<ICreateOrg> = (values) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("email_domain", values.email_domain);
    formData.append("code", values.code);
    formData.append("type", values.org_type.value);
    if (values.logo !== undefined) {
      formData.append("logo", values.logo);
    }
    createOrg(formData);
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
                <FormInput label="Name" type="text" name="name" />
              </div>
              <div className="grid grid-cols-1">
                <FormInput label="Email" type="email" name="email_domain" />
              </div>
              <div className="grid grid-cols-1">
                <FormInput label="Code" type="text" name="code" />
              </div>
              <div className="grid grid-cols-1">
                <FormSelect
                  label="Type"
                  name="org_type"
                  isLoading={isOrgTypeLoading}
                  data={
                    isSuccess
                      ? orgTypes.data.map((item) => ({
                          value: item,
                          label: item,
                        }))
                      : []
                  }
                  isMulti={false}
                  isRtl={false}
                />
              </div>
              <div className="flex flex-col items-center">
                <FileUpLoader
                  name="logo"
                  multiple={false}
                  label="select Logo"
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

export default Add;
