import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex h-[50px] w-full border-0 border-b-2 border-muted-foreground placeholder:text-muted-foreground bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden", // Added overflow-hidden to hide scrollbar
          className
        )}
        ref={ref}
        {...props}
      />
    );
    
    
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
