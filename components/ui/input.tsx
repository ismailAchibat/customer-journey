import React from "react";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={clsx(
          "h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300",
          className
        )}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
