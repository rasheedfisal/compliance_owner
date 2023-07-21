"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { TypeOf, object, string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronDoubleLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import FormInputShow from "@/components/FormInputShow";
import { useRouter } from "next/navigation";
import TrashedButton from "@/components/TrashedButton";
import Link from "next/link";
import { deleteOnboardingFn, getOnboardingFn } from "@/api/onboardingsApi";
import { getUserFn } from "@/api/authApi";
import VerfiedBadge from "@/components/VerfiedBadge";

type PageProps = {
  params: {
    DId: string;
  };
};

const showSchema = object({
  name: string(),
  email: string(),
  email_verified_at: string(),
  created_at: string(),
});

type IShow = TypeOf<typeof showSchema>;

const Show = ({ params: { DId } }: PageProps) => {
  const router = useRouter();
  const { isLoading: isUserLoading, data } = useQuery(
    ["users", DId],
    () => getUserFn(DId),
    {
      select: (data) => data,
      retry: 1,
      onSuccess: ({ error, data }) => {
        if (!error) {
          methods.reset({
            name: data.name,
            email: data.email,
            email_verified_at: data?.email_verified_at?.toString(),
            created_at: data.created_at.toString(),
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

  const { isLoading, mutate: deleteOnboarding } = useMutation(
    ({ id }: { id: string }) => deleteOnboardingFn({ id }),
    {
      onSuccess: ({ message }) => {
        toast.success(message);
        router.push("/onboardings");
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

  const methods = useForm<IShow>({
    resolver: zodResolver(showSchema),
  });

  if (isUserLoading) {
    return <p>Loading...</p>;
  }

  const onSubmitHandler: SubmitHandler<IShow> = (values) => {
    if (confirm("are you sure you want to delete this?")) {
      deleteOnboarding({ id: DId });
    }
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
          <label className="font-semibold">
            {"Account"}{" "}
            {<VerfiedBadge verfiedDate={data?.data.email_verified_at} />}
          </label>
          <FormProvider {...methods}>
            <form
              className="space-y-6"
              noValidate
              autoComplete="off"
              // onSubmit={methods.handleSubmit(onSubmitHandler)}
            >
              <div className="grid grid-cols-1">
                <FormInputShow label="Name" type="text" name="name" />
              </div>
              <div className="grid grid-cols-1">
                <FormInputShow label="Email" type="email" name="email" />
              </div>

              <div className="grid grid-cols-1">
                <FormInputShow
                  label="Created At"
                  type="text"
                  name="created_at"
                />
              </div>
              {/* {!data?.data.is_complete ? (
                <div>
                  <TrashedButton
                    title="Delete"
                    clicked={isLoading}
                    loadingTitle="loading..."
                    icon={<TrashIcon className="h-5 w-5" />}
                  />
                </div>
              ) : null} */}
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default Show;
