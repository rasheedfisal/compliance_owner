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
import { createOnboardingsFn } from "@/api/onboardingsApi";
import { getAllSubDominFn } from "@/api/subDomainApi";
import { ICreateUpdateControls, ICreateUpdateOnboarding } from "@/typings";
import { useRouter } from "next/navigation";
import FormSelect from "@/components/FormSelect";
import {
  getOrganizationListFn,
  getRegulatorListFn,
} from "@/api/selectablesApi";

const createUpdateOnboardingSchema = object({
  email: string().min(1, "Email is required").email(),
  regulator: z.object({
    label: z.string(),
    value: z.string(),
  }),
  org: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

export type IUpsertOnboarding = TypeOf<typeof createUpdateOnboardingSchema>;

const Add = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    isLoading: isOrgLoading,
    isSuccess: isOrgSuccess,
    data: orgList,
  } = useQuery(["organizations-list"], () => getOrganizationListFn(), {
    retry: 1,
    onError: (error) => {
      if ((error as any).response?.data?.msg) {
        toast.error((error as any).response?.data?.msg, {
          position: "top-right",
        });
      }
    },
  });
  const {
    isLoading: isRegulatorLoading,
    isSuccess: isRegultorSuccess,
    data: regulatorList,
  } = useQuery(["regulators-list"], () => getRegulatorListFn(), {
    retry: 1,
    onError: (error) => {
      if ((error as any).response?.data?.msg) {
        toast.error((error as any).response?.data?.msg, {
          position: "top-right",
        });
      }
    },
  });

  const { isLoading, mutate: createOnboarding } = useMutation(
    (onboarding: ICreateUpdateOnboarding) => createOnboardingsFn(onboarding),
    {
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries(["onboardings"]);
        toast.success(message);
        router.push("/onboardings");
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

  const methods = useForm<IUpsertOnboarding>({
    resolver: zodResolver(createUpdateOnboardingSchema),
  });
  const {
    formState: { isSubmitSuccessful },
  } = methods;

  // useUpdateEffect(() => {
  //   if (isSubmitSuccessful) {
  //     methods.reset();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<IUpsertOnboarding> = (values) => {
    const onboarding: ICreateUpdateOnboarding = {
      email: values.email,
      regulator_id: values.regulator.value,
      organization_id: values.org.value,
    };
    createOnboarding(onboarding);
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
                <FormSelect
                  label="Regulator"
                  name="regulator"
                  isLoading={isRegulatorLoading}
                  data={
                    isRegultorSuccess
                      ? regulatorList.data.map(({ id, name }) => ({
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
                <FormSelect
                  label="Organization"
                  name="org"
                  isLoading={isOrgLoading}
                  data={
                    isOrgSuccess
                      ? orgList.data.map(({ id, name }) => ({
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
                <FormInput label="Email" type="email" name="email" />
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
