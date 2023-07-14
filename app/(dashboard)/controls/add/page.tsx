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
import { createControlsFn } from "@/api/controlsApi";
import { getAllSubDominFn } from "@/api/subDomainApi";
import { ICreateUpdateControls } from "@/typings";
import { useRouter } from "next/navigation";
import FormSelect from "@/components/FormSelect";

const createUpdateContrlsSchema = object({
  name: string().min(1, "Name is required"),
  code: z
    .string()
    .min(1, "Code is Required")
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  subdomain: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

export type IUpsertControls = TypeOf<typeof createUpdateContrlsSchema>;

const Add = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    isLoading: isDomainLoading,
    isSuccess,
    data: subdomains,
  } = useQuery(["sub-domains"], () => getAllSubDominFn(), {
    select: (data) => data,
    retry: 1,
    onSuccess(data) {
      console.log(data.data);
    },
    onError: (error) => {
      if ((error as any).response?.data?.msg) {
        toast.error((error as any).response?.data?.msg, {
          position: "top-right",
        });
      }
    },
  });

  const { isLoading, mutate: createControls } = useMutation(
    (subdomain: ICreateUpdateControls) => createControlsFn(subdomain),
    {
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries(["controls"]);
        toast.success(message);
        router.push("/controls");
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

  const methods = useForm<IUpsertControls>({
    resolver: zodResolver(createUpdateContrlsSchema),
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

  const onSubmitHandler: SubmitHandler<IUpsertControls> = (values) => {
    const subDomain: ICreateUpdateControls = {
      name: values.name,
      code: values.code,
      sub_domain_id: values.subdomain.value,
    };
    createControls(subDomain);
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-end px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <Link
          href="/controls"
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
                <FormInput label="Name" type="text" name="name" />
              </div>
              <div className="grid grid-cols-1">
                <FormInput label="Code" type="text" name="code" />
              </div>
              <div className="grid grid-cols-1">
                <FormSelect
                  label="Sub Domains"
                  name="subdomain"
                  isLoading={isDomainLoading}
                  data={
                    isSuccess
                      ? subdomains.data.map(({ id, name }) => ({
                          value: id.toString(),
                          label: name,
                        }))
                      : []
                  }
                  isMulti={false}
                  isRtl={false}
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
