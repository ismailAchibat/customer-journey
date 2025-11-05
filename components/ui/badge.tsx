import React from "react";
import clsx from "clsx";

type BadgeProps = React.PropsWithChildren<{
  className?: string;
}>;

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
