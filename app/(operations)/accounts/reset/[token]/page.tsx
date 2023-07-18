"use client";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { resetPasswordFn } from "@/api/authApi";
import { useMutation } from "@tanstack/react-query";

import FormInput2 from "../../../../../components/FormInput2";
import SubmitButton from "../../../../../components/SubmitButton";
import useUpdateEffect from "../../../../../hooks/useUpdateEffect";
import { IResetPassword } from "@/typings";
type PageProps = {
  params: {
    token: string;
  };
};

const forgetPasswordSchema = object({
  password: string().min(1, "Password address is required"),
  confirm: string().min(1, "Password address is required"),
}).refine((data) => data.confirm === data.password, {
  message: "Passwords don't match",
  path: ["confirm"],
});

export type ResetInput = TypeOf<typeof forgetPasswordSchema>;
const Reset = ({ params: { token } }: PageProps) => {
  const router = useRouter();
  const methods = useForm<ResetInput>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const { mutate: forgetPassword, isLoading } = useMutation(
    (userData: IResetPassword) => resetPasswordFn(userData),
    {
      onSuccess: (data) => {
        toast.success("Sucess: check your email for verfication link");
        router.push("/login");
      },
      onError: (error: any) => {
        if ((error as any).response?.data?.msg) {
          toast.error((error as any).response?.data?.msg, {
            position: "top-right",
          });
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

  const onSubmitHandler: SubmitHandler<ResetInput> = (values) => {
    // 👇 Executing the loginUser Mutation
    forgetPassword({ ...values, token });
  };

  return (
    <div className="w-full max-w-sm px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
      <h1 className="text-xl font-semibold text-center">Reset password</h1>
      <p className="text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        You are only one step a way from your new password, recover your
        password now.
      </p>
      <FormProvider {...methods}>
        <form
          className="space-y-6"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <FormInput2 name="password" label="Password" type="password" />
          <FormInput2 name="confirm" label="Confirm Password" type="password" />
          <div>
            <SubmitButton
              title="Reset"
              clicked={isLoading}
              loadingTitle="loading..."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 5.25c1.213 0 2.415.046 3.605.135a3.256 3.256 0 013.01 3.01c.044.583.077 1.17.1 1.759L17.03 8.47a.75.75 0 10-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 00-1.06-1.06l-1.752 1.751c-.023-.65-.06-1.296-.108-1.939a4.756 4.756 0 00-4.392-4.392 49.422 49.422 0 00-7.436 0A4.756 4.756 0 003.89 8.282c-.017.224-.033.447-.046.672a.75.75 0 101.497.092c.013-.217.028-.434.044-.651a3.256 3.256 0 013.01-3.01c1.19-.09 2.392-.135 3.605-.135zm-6.97 6.22a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.752-1.751c.023.65.06 1.296.108 1.939a4.756 4.756 0 004.392 4.392 49.413 49.413 0 007.436 0 4.756 4.756 0 004.392-4.392c.017-.223.032-.447.046-.672a.75.75 0 00-1.497-.092c-.013.217-.028.434-.044.651a3.256 3.256 0 01-3.01 3.01 47.953 47.953 0 01-7.21 0 3.256 3.256 0 01-3.01-3.01 47.759 47.759 0 01-.1-1.759L6.97 15.53a.75.75 0 001.06-1.06l-3-3z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Reset;
