"use client";

import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { object, string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import FormInput from "@/components/FormInput";
import SubmitButton from "@/components/SubmitButton";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { createDomainFn } from "@/api/domainApi";
import { ICreateUpdateDomain } from "@/typings";
import { useRouter } from "next/navigation";

const createUpdateDomainSchema = object({
  name: string().min(1, "Name is required"),
  code: z
    .string()
    .min(1, "Code is Required")
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
});

const Add = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isLoading, mutate: createDomain } = useMutation(
    (domain: ICreateUpdateDomain) => createDomainFn(domain),
    {
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries(["domains"]);
        toast.success(message);
        router.push("/domains");
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

  const methods = useForm<ICreateUpdateDomain>({
    resolver: zodResolver(createUpdateDomainSchema),
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

  const onSubmitHandler: SubmitHandler<ICreateUpdateDomain> = (values) => {
    createDomain(values);
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

export default Add;
