import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'glass' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: "bg-gradient-to-r from-blue-500/80 to-purple-600/80 hover:from-blue-600/90 hover:to-purple-700/90 text-white border-transparent",
      glass: "bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md",
      outline: "border-white/30 hover:bg-white/10 text-white bg-transparent"
    }
    
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-12 px-6 text-base",
      lg: "h-14 px-8 text-lg"
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50 border",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
