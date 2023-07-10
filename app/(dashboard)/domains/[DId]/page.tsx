"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SubmitButton from "@/components/SubmitButton";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import FormInput from "@/components/FormInput";
import { useRouter } from "next/navigation";
import { getDominFn, updateDomainFn } from "@/api/domainApi";
import { ICreateUpdateDomain } from "@/typings";

type PageProps = {
  params: {
    DId: string;
  };
};

const updatePriceSchema = object({
  name: string().min(1, "Name is required"),
  code: z
    .string()
    .min(1, "Code is Required")
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
});

const Edit = ({ params: { DId } }: PageProps) => {
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

  const { isLoading, mutate: updateDomin } = useMutation(
    ({ id, domain }: { id: string; domain: ICreateUpdateDomain }) =>
      updateDomainFn({ id, domain }),
    {
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries(["domains"]);
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
    resolver: zodResolver(updatePriceSchema),
  });

  if (isDomainLoading) {
    return <p>Loading...</p>;
  }

  const onSubmitHandler: SubmitHandler<ICreateUpdateDomain> = (values) => {
    updateDomin({ id: DId, domain: values });
  };

  return (
    <>
      {/* <!-- Content header --> */}

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
