import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

type IFormInputShowProps = {
  name: string;
  label: string;
  type: string;
};

const FormInputShow: FC<IFormInputShowProps> = ({ name, label, type }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      control={control}
      defaultValue=""
      name={name}
      render={({ field }) => (
        <div className="flex gap-3 items-center w-full">
          <label className="font-bold">
            {label} {":"}
          </label>
          <input
            {...field}
            className="px-4 py-2 flex-1 border-0 rounded-md dark:bg-darker focus:outline-none"
            name="title"
            type={type}
            disabled
            autoComplete="off"
          />
          {errors[name] && (
            <div className="mb-3 text-normal text-red-500">
              {errors[name]?.message?.toString()}
            </div>
          )}
        </div>
      )}
    />
  );
};

export default FormInputShow;
