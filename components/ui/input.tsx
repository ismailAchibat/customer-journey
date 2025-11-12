import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const inputProps = { ...props };
  if (inputProps.value === undefined) {
    delete inputProps.value;
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
      )}
      {...inputProps}
    />
  )
}

export { Input }