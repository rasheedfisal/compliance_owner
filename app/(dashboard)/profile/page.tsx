"use client";

import { useStateContext } from "@/context/AppConext";
import { object, string, TypeOf, z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import FileUpLoader from "@/components/FileUploader";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useState } from "react";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const updateUserSchema = object({
  name: string().min(1, "Name is required"),
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  profileImage: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    )
    .optional(),
  password: string().optional(),
}).partial();

type IUpdateUser = TypeOf<typeof updateUserSchema>;
const profile = () => {
  const [img, setImg] = useState("");
  const stateContext = useStateContext();

  useUpdateEffect(() => {
    methods.reset({
      name: stateContext.state?.authUser?.name,
      email: stateContext.state?.authUser?.email,
    });
    setImg("/noImg.jpg");
  }, []);
  useUpdateEffect(() => {
    methods.reset({
      name: stateContext.state?.authUser?.name,
      email: stateContext.state?.authUser?.email,
    });
    setImg("/noImg.jpg");
  }, [stateContext.state]);

  useUpdateEffect(() => {
    setImg("/noImg.jpg");
  }, [stateContext.state]);

  const methods = useForm<IUpdateUser>({
    resolver: zodResolver(updateUserSchema),
  });

  const VerfiedBadge = stateContext.state.authUser?.email_verified_at ? (
    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
      Verified
    </span>
  ) : (
    <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
      Not Verfied
    </span>
  );

  return (
    <>
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>
      <div className="mt-5">
        <div className="min-w-full rounded gap-5 lg:grid lg:grid-cols-3">
          <div className="lg:block lg:col-span-1 px-4 py-6  rounded-md bg-white dark:bg-darker">
            {/* <div className="w-full relative px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker"> */}
            <div className="flex justify-between">
              <span className="text-xl font-semibold block">
                {stateContext.state.authUser?.role} {VerfiedBadge}
              </span>
              {/* <a
                href="#"
                className="-mt-2 text-md font-bold text-white bg-gray-700 rounded-full px-5 py-2 hover:bg-gray-800"
              >
                Edit
              </a> */}
            </div>

            <span className="text-gray-600">
              This information is secret so be careful
            </span>
            <div className="w-full p-8 mx-2 flex justify-center">
              <img
                id="showImage"
                className="max-w-xs w-32 items-center border"
                src={img}
                alt=""
              />
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

                <div className="flex flex-col items-center">
                  <FileUpLoader
                    name="profileImage"
                    multiple={false}
                    label="select avatar"
                  />
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default profile;
