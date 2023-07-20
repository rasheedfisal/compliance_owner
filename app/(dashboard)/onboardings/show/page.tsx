"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { TypeOf, object, string, z } from "zod";
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
import { deleteOnboardingFn, getOnboardingFn } from "@/api/onboardingsApi";

type PageProps = {
  params: {
    DId: string;
  };
};

const showSchema = object({
  email: string(),
  created_at: string(),
  org_name: string(),
  org_email_domain: string(),
  regulator_name: string(),
  regulator_email_domain: string(),
});

type IShow = TypeOf<typeof showSchema>;

const Show = ({ params: { DId } }: PageProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isLoading: isOnboardingLoading, data } = useQuery(
    ["onboardings", DId],
    () => getOnboardingFn(DId),
    {
      select: (data) => data,
      retry: 1,
      onSuccess: ({ error, data }) => {
        if (!error) {
          methods.reset({
            email: data.email,
            created_at: data.created_at.toString(),
            org_email_domain: data.organization.email_domain,
            org_name: data.organization.name,
            regulator_email_domain: data.regulator.email_domain,
            regulator_name: data.regulator.name,
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

  if (isOnboardingLoading) {
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
          href="/onboardings"
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
                <FormInputShow label="Email" type="email" name="email" />
              </div>
              <div className="grid grid-cols-1">
                <FormInputShow
                  label="Created At"
                  type="text"
                  name="created_at"
                />
              </div>
              <div className="grid grid-cols-1">
                <FormInputShow
                  label="Organization Name"
                  type="text"
                  name="org_name"
                />
              </div>
              <div className="grid grid-cols-1">
                <FormInputShow
                  label="Organization Domain"
                  type="text"
                  name="org_email_domain"
                />
              </div>

              <div className="grid grid-cols-1">
                <FormInputShow
                  label="Regulator Name"
                  type="text"
                  name="regulator_name"
                />
              </div>
              <div className="grid grid-cols-1">
                <FormInputShow
                  label="Regulator Domain"
                  type="text"
                  name="regulator_email_domain"
                />
              </div>
              {!data?.data.is_complete ? (
                <div>
                  <TrashedButton
                    title="Delete"
                    clicked={isLoading}
                    loadingTitle="loading..."
                    icon={<TrashIcon className="h-5 w-5" />}
                  />
                </div>
              ) : null}
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default Show;
