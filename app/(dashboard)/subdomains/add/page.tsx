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
import { createSubDomainFn } from "@/api/subDomainApi";
import { getAllDominFn } from "@/api/domainApi";
import { ICreateUpdateSubDomain } from "@/typings";
import { useRouter } from "next/navigation";
import FormSelect from "@/components/FormSelect";

const createUpdateSubDomainSchema = object({
  name: string().min(1, "Name is required"),
  code: z
    .string()
    .min(1, "Code is Required")
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  domain: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

export type IUpsertSubDomain = TypeOf<typeof createUpdateSubDomainSchema>;

const Add = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    isLoading: isDomainLoading,
    isSuccess,
    data: domains,
  } = useQuery(["domains"], () => getAllDominFn(), {
    select: (data) => data,
    retry: 1,
    onError: (error) => {
      if ((error as any).response?.data?.msg) {
        toast.error((error as any).response?.data?.msg, {
          position: "top-right",
        });
      }
    },
  });

  const { isLoading, mutate: createSubDomain } = useMutation(
    (subdomain: ICreateUpdateSubDomain) => createSubDomainFn(subdomain),
    {
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries(["sub-domains"]);
        toast.success(message);
        router.push("/subdomains");
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

  const methods = useForm<IUpsertSubDomain>({
    resolver: zodResolver(createUpdateSubDomainSchema),
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

  const onSubmitHandler: SubmitHandler<IUpsertSubDomain> = (values) => {
    const subDomain: ICreateUpdateSubDomain = {
      name: values.name,
      code: values.code,
      domain_id: values.domain.value,
    };
    createSubDomain(subDomain);
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-end px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <Link
          href="/subdomains"
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
                  label="Domains"
                  name="domain"
                  isLoading={isDomainLoading}
                  data={
                    isSuccess
                      ? domains.data.map(({ id, name }) => ({
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
