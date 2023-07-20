"use client";

import { useStateContext } from "@/context/AppConext";
import { object, string, TypeOf, z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import VerfiedBadge from "@/components/VerfiedBadge";

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

type IUpdateUser = TypeOf<typeof updateUserSchema>;
const Profile = () => {
  // const [img, setImg] = useState("");
  const stateContext = useStateContext();

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
