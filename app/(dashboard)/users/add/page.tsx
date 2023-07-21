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
import { createUserFn } from "@/api/authApi";

const createUserSchema = object({
  name: string().min(1, "Name is required"),
  email: string().min(1, "Name is required"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  confirm: string().min(1, "Confirm Password is required"),
}).refine((data) => data.confirm === data.password, {
  message: "Passwords don't match",
  path: ["confirm"],
});

export type ICreateUser = TypeOf<typeof createUserSchema>;

const Add = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { isLoading, mutate: createUser } = useMutation(
    (user: ICreateUser) => createUserFn(user),
    {
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries(["users"]);
        toast.success(message);
        router.push("/users");
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

  const methods = useForm<ICreateUser>({
    resolver: zodResolver(createUserSchema),
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

  const onSubmitHandler: SubmitHandler<ICreateUser> = (values) => {
    createUser(values);
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-end px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <Link
          href="/users"
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
                <FormInput name="name" label="Name" type="text" />
              </div>
              <div className="grid grid-cols-1">
                <FormInput name="email" label="Email" type="email" />
              </div>
              <div className="grid grid-cols-1">
                <FormInput name="password" label="Password" type="password" />
              </div>
              <div className="grid grid-cols-1">
                <FormInput
                  name="confirm"
                  label="Re-type Password"
                  type="password"
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
