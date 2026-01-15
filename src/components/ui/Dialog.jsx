import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import clsx from "clsx"
import { useColors } from "../../hooks/useColors"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogClose = DialogPrimitive.Close

export const DialogOverlay = ({ className, ...props }) => {
  const colors = useColors()
  return (
    <DialogPrimitive.Overlay
      className={clsx(
        "fixed inset-0 z-50 backdrop-blur-sm",
        colors.isDark ? "bg-black/60" : "bg-black/40",
        className
      )}
      {...props}
    />
  )
}

export const DialogContent = ({ children, className, ...props }) => {
  const colors = useColors()
  
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={clsx(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl p-6 shadow-lg border",
          colors.bgCard,
          colors.border,
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className={clsx(
            "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none",
            colors.textMuted
          )}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

export const DialogHeader = ({ className, ...props }) => {
  return (
    <div
      className={clsx("flex flex-col space-y-1.5 text-center sm:text-right", className)}
      {...props}
    />
  )
}

export const DialogTitle = ({ className, ...props }) => {
  const colors = useColors()
  return (
    <DialogPrimitive.Title
      className={clsx("text-lg font-semibold leading-none tracking-tight", colors.text, className)}
      {...props}
    />
  )
}

export const DialogDescription = ({ className, ...props }) => {
  const colors = useColors()
  return (
    <DialogPrimitive.Description
      className={clsx("text-sm", colors.textSecondary, className)}
      {...props}
    />
  )
}
