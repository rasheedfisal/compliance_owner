"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  UserIcon,
  EnvelopeIcon,
  ShieldExclamationIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useStateContext } from "@/context/AppConext";
import { getByTokenFn } from "@/api/onboardingsApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import FormInput3 from "@/components/FormInput3";
import SubmitButton from "@/components/SubmitButton";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { registerOnboardingsFn } from "@/api/onboardingsApi";
import { BounceLoader } from "react-spinners";

type PageProps = {
  params: {
    token: string;
  };
};

const onboardingSchema = object({
  name: string().min(1, "Name is required"),
  email_username: string().min(1, "Name is required"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  confirm: string().min(1, "Confirm Password is required"),
}).refine((data) => data.confirm === data.password, {
  message: "Passwords don't match",
  path: ["confirm"],
});

export type OnboardingInput = TypeOf<typeof onboardingSchema>;

export type CreateOnboarding = OnboardingInput & { token: string };

const Register = ({ params: { token } }: PageProps) => {
  const router = useRouter();

  const methods = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
  });

  const stateContext = useStateContext();

  // API Get Current Logged-in user
  const { isLoading: isDataLoading, data: onboardingInfo } = useQuery(
    ["onboardings", token],
    () => getByTokenFn(token),
    {
      select: (data) => data,
      retry: 1,
      // staleTime: Infinity,
      onSuccess: ({ data }) => {},
      onError(err) {},
    }
  );

  //  API Login Mutation
  const { mutate: registerOnboarding, isLoading } = useMutation(
    (userData: CreateOnboarding) => registerOnboardingsFn(userData),
    {
      onSuccess: ({ message }) => {
        toast.success(message);
        router.push("/login");
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

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useUpdateEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<OnboardingInput> = (values) => {
    // 👇 Executing the loginUser Mutation
    registerOnboarding({ ...values, token });
  };

  if (isDataLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center text-2xl font-semibold bg-white">
        {/* Loading..... */}
        <BounceLoader size={50} color="#8b8d8d" speedMultiplier={3} />
      </div>
    );
  }

  return (
    <div className="min-w-full rounded gap-5 lg:grid lg:grid-cols-3">
      <div className="lg:block lg:col-span-1 px-4 py-6 space-y-4 rounded-md bg-white dark:bg-darker">
        <span className="text-gray-600 font-medium block">
          {"Welcome "}{" "}
          <span className="text-primary font-bold">
            {onboardingInfo?.data.organization.name}
          </span>{" "}
          {","}
        </span>
        <span className="text-gray-600 font-medium block">
          {"this is the registration request sent by "}{" "}
          <span className="text-primary font-bold">
            {onboardingInfo?.data.regulator.name}
          </span>
        </span>
        <div className="flex flex-col space-y-2">
          <div className="flex gap-3">
            <label className="text-sm font-medium">your email {":"}</label>
            <span className="text-sm"> {onboardingInfo?.data.email}</span>
          </div>
          <div className="flex gap-3">
            <label className="text-sm font-medium">Code {":"}</label>
            <span className="text-sm">
              {onboardingInfo?.data.organization.code}
            </span>
          </div>
          <div className="flex gap-3">
            <label className="text-sm font-medium">Created At {":"}</label>
            <span className="text-sm">
              {onboardingInfo?.data.created_at.toString()}
            </span>
          </div>
          {/* <div className="flex gap-3">
            <label className="text-sm font-medium">Role {":"}</label>
            <span className="text-sm text-primary font-bold">{"test "}</span>
          </div>*/}
        </div>
      </div>
      <div className="lg:col-span-2 px-4 py-6 rounded bg-white dark:bg-darker space-y-4">
        <span className="text-gray-600 font-bold">
          {" Please Fill the Form Below :"}
        </span>
        <FormProvider {...methods}>
          <form
            className="space-y-6"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <div className="grid grid-cols-1">
              <FormInput3
                name="name"
                label="Name"
                type="text"
                icon={<UserIcon className="h-4 w-4" />}
              />
            </div>
            <div className="grid grid-cols-1">
              <FormInput3
                name="email_username"
                label="Email Username"
                type="text"
                icon={<EnvelopeIcon className="w-4 h-4" />}
                text={onboardingInfo?.data.organization.email_domain}
              />
            </div>
            <div className="grid grid-cols-1">
              <FormInput3
                name="password"
                label="Password"
                type="password"
                icon={<ShieldExclamationIcon className="w-4 h-4" />}
              />
            </div>
            <div className="grid grid-cols-1">
              <FormInput3
                name="confirm"
                label="Re-type Password"
                type="password"
                icon={<ShieldExclamationIcon className="w-4 h-4" />}
              />
            </div>
            <div>
              <SubmitButton
                title="Register"
                clicked={isLoading}
                loadingTitle="loading..."
                icon={<CreditCardIcon className="w-6 h-6" />}
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Register;
