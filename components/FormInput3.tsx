import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

type IFormInputProps = {
  name: string;
  label: string;
  type: string;
  icon?: JSX.Element;
  text?: string;
};

const FormInput3: FC<IFormInputProps> = ({
  name,
  label,
  type,
  icon = null,
  text = null,
}) => {
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
        <div>
          <label
            htmlFor={name}
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            {label}
          </label>
          <div className="relative">
            <input
              {...field}
              className={`px-4 py-2 ${icon ? "pl-9" : ""} ${
                text ? "pr-40" : ""
              }  border w-full border-gray-400 rounded-md ring-inset dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker sm:text-sm`}
              // name="title"
              id={name}
              type={type}
              autoComplete="off"
            />

            {icon && (
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                <span className="text-gray-500">{icon}</span>
              </div>
            )}

            {text && (
              <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                <span className="text-gray-500">{text}</span>
              </div>
            )}
          </div>
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

export default FormInput3;
