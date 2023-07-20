"use client";
import { sendEmailOTPFn, verifyEmailFn } from "@/api/authApi";
import ClickButton from "@/components/ClickButton";
import FormInput from "@/components/FormInput";
import SubmitButton from "@/components/SubmitButton";
import { useStateContext } from "@/context/AppConext";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { DocumentPlusIcon, PaperClipIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { TypeOf, object, string } from "zod";

const updateVerifySchema = object({
  email: string().min(1, "Code is required"),
});

export type IUpdateVerfiy = TypeOf<typeof updateVerifySchema>;

const VerifiedPage = () => {
  const stateContext = useStateContext();
  const router = useRouter();
  const { isLoading, mutate: sendOTP } = useMutation(() => sendEmailOTPFn(), {
    onSuccess: ({ message }) => {
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

  const verifyMethods = useForm<IUpdateVerfiy>({
    resolver: zodResolver(updateVerifySchema),
  });
  const {
    formState: { isSubmitSuccessful: isVerifySuccessful },
  } = verifyMethods;

  useUpdateEffect(() => {
    if (isVerifySuccessful) {
      verifyMethods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerifySuccessful]);

  const onSubmitHandler: SubmitHandler<IUpdateVerfiy> = (values) => {
    verifyEmail(values);
  };

  if (stateContext.state.authUser?.email_verified_at !== null) {
    router.back();
  }

  return (
    <div className="grid grid-cols-1 p-4">
      <div className="w-full relative px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
        <label className="block font-semibold text-red-600">
          {"**your email is not verified, you can't perform any action**"}
        </label>

        <ClickButton
          title="please click here to be sent a verfication code to your email"
          clicked={isLoading}
          loadingTitle="sending verification code..."
          icon={<PaperClipIcon className="h-5 w-5" />}
          clickHandler={() => sendOTP()}
        />

        <div className="border border-gray-200 p-5">
          <label className="text-center font-semibold text-blue-600">
            {"**add the code received from your email here**"}
          </label>
          <FormProvider {...verifyMethods}>
            <form
              className="space-y-6 mt-3"
              noValidate
              autoComplete="off"
              onSubmit={verifyMethods.handleSubmit(onSubmitHandler)}
            >
              <div className="grid grid-cols-1">
                <FormInput label="Code" type="text" name="token" />
              </div>
              <div className="flex">
                <SubmitButton
                  title="Verify"
                  clicked={isverifing}
                  loadingTitle="loading..."
                  icon={<DocumentPlusIcon className="h-5 w-5" />}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default VerifiedPage;
