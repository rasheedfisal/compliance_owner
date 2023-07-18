"use client";

import { useStateContext } from "@/context/AppConext";
import { object, string, TypeOf, z } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import FileUpLoader from "@/components/FileUploader";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useState } from "react";
import VerfiedBadge from "@/components/VerfiedBadge";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { sendEmailOTPFn, verifyEmailFn } from "@/api/authApi";
import ClickButton from "@/components/ClickButton";
import { DocumentPlusIcon, PaperClipIcon } from "@heroicons/react/24/solid";
import SubmitButton from "@/components/SubmitButton";

const updateUserSchema = object({
  name: string().min(1, "Name is required"),
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  // profileImage: z
  //   .any()
  //   .refine((files) => files?.length == 1, "Image is required.")
  //   .refine(
  //     (files) => files?.[0]?.size <= MAX_FILE_SIZE,
  //     `Max file size is 5MB.`
  //   )
  //   .refine(
  //     (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
  //     ".jpg, .jpeg, .png and .webp files are accepted."
  //   )
  //   .optional(),
  //password: string().optional(),
}).partial();

const updateVerifySchema = object({
  email: string().min(1, "Code is required"),
});

type IUpdateUser = TypeOf<typeof updateUserSchema>;
export type IUpdateVerfiy = TypeOf<typeof updateVerifySchema>;
const Profile = () => {
  // const [img, setImg] = useState("");
  const stateContext = useStateContext();

  const { isLoading, mutate: sendOTP } = useMutation(() => sendEmailOTPFn(), {
    onSuccess: ({ message }) => {
      // queryClient.invalidateQueries(["regulators"]);
      toast.success("Sucess: check your email for verfication code");
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
  });
  const { isLoading: isverifing, mutate: verifyEmail } = useMutation(
    (verify: IUpdateVerfiy) => verifyEmailFn(verify),
    {
      onSuccess: ({ message }) => {
        // queryClient.invalidateQueries(["regulators"]);
        toast.success(message);
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

  useUpdateEffect(() => {
    methods.reset({
      name: stateContext.state?.authUser?.name,
      email: stateContext.state?.authUser?.email,
    });
    // setImg("/noImg.jpg");
  }, []);
  useUpdateEffect(() => {
    methods.reset({
      name: stateContext.state?.authUser?.name,
      email: stateContext.state?.authUser?.email,
    });
  }, [stateContext.state]);

  const methods = useForm<IUpdateUser>({
    resolver: zodResolver(updateUserSchema),
  });

  const verifyMethods = useForm<IUpdateVerfiy>({
    resolver: zodResolver(updateVerifySchema),
  });
  const {
    formState: { isSubmitSuccessful },
  } = verifyMethods;

  useUpdateEffect(() => {
    if (isSubmitSuccessful) {
      verifyMethods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<IUpdateVerfiy> = (values) => {
    verifyEmail(values);
  };

  return (
    <>
      {/* <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div> */}
      <div className="mt-5">
        <div className="min-w-full rounded gap-5 lg:grid lg:grid-cols-3">
          <div className="lg:block lg:col-span-1 px-4 py-6  rounded-md bg-white dark:bg-darker">
            {/* <div className="w-full relative px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker"> */}
            <div className="flex justify-between mb-3">
              <span className="text-xl font-semibold block">
                {"Account "}
                {
                  <VerfiedBadge
                    verfiedDate={stateContext.state.authUser?.email_verified_at}
                  />
                }
              </span>
              {!stateContext.state.authUser?.email_verified_at ? (
                <ClickButton
                  title="please click here to verify your email"
                  clicked={isLoading}
                  loadingTitle="sending verification code..."
                  icon={<PaperClipIcon className="h-5 w-5" />}
                  clickHandler={() => sendOTP()}
                />
              ) : null}
            </div>

            <span className="text-gray-600 font-bold">
              This information is secret so be careful
            </span>
            <div className="flex flex-col space-y-2 mt-2">
              <div className="flex gap-3">
                <label className="text-sm font-medium">Name {":"}</label>
                <span className="text-sm">
                  {stateContext.state.authUser?.name}
                </span>
              </div>
              <div className="flex gap-3">
                <label className="text-sm font-medium">Email {":"}</label>
                <span className="text-sm">
                  {stateContext.state.authUser?.email}
                </span>
              </div>
              <div className="flex gap-3">
                <label className="text-sm font-medium">Created At {":"}</label>
                <span className="text-sm">
                  {stateContext.state.authUser?.created_at?.toString()}
                </span>
              </div>
              <div className="flex gap-3">
                <label className="text-sm font-medium">Role {":"}</label>
                <span className="text-sm text-primary font-bold">
                  {stateContext.state.authUser?.role}
                </span>
              </div>
              {!stateContext.state.authUser?.email_verified_at ? (
                <div className="flex gap-3 border border-gray-200">
                  <label className="text-xs">
                    {
                      "verify email section by adding the code received from your email"
                    }
                  </label>
                  <FormProvider {...verifyMethods}>
                    <form
                      className="space-y-6 mt-3"
                      noValidate
                      autoComplete="off"
                    >
                      <div className="grid grid-cols-1">
                        <FormInput label="Code" type="text" name="token" />
                      </div>
                      <div className="flex">
                        <SubmitButton
                          title="Submit"
                          clicked={isverifing}
                          loadingTitle="loading..."
                          icon={<DocumentPlusIcon className="h-5 w-5" />}
                        />
                      </div>
                    </form>
                  </FormProvider>
                </div>
              ) : null}
            </div>
          </div>
          {/* <div className="w-full relative px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker"> */}

          <div className="lg:col-span-2 px-4 py-6 rounded-md bg-white dark:bg-darker">
            <FormProvider {...methods}>
              <form className="space-y-6" noValidate autoComplete="off">
                <div className="grid grid-cols-1">
                  <FormInput label="Name" type="text" name="name" />
                </div>
                <div className="grid grid-cols-1">
                  <FormInput label="Email" type="email" name="email" />
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
