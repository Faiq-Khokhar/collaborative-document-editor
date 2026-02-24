import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const typography = cva("", {
  variants: {
    size: {
      h1: ["text-3xl"],
      h2: ["text-h2"],
      h3: ["text-h3"],
      h4: ["text-h4"],
      h5: ["text-h5"],
      h6: ["text-h6"],
      xl: ["text-xl"],
      lg: ["text-lg"],
      md: ["text-md"],
      sm: ["text-sm"],
      xs: ["text-xs"],
    },
    tone: {
      default: "text-slate-900",
      muted: "text-slate-600",
      subtle: "text-slate-500",
      inverse: "text-white",
      blue: "text-sky-700",
    },
    weight: {
      thin: "font-thin",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
  },
  defaultVariants: {
    size: "lg",
    weight: "normal",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typography> {
  as?: React.ElementType;
}

export const Typography: React.FC<TypographyProps> = ({
  as: Component = "p",
  className = "",
  size,
  tone,
  weight,
  ...props
}) => {
  return (
    <Component
      className={`${typography({ size, tone, weight })} ${className}`}
      {...props}
    />
  );
};
