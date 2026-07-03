import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge doesn't know our custom `text-*` font sizes (defined in
 * tailwind.config.ts). Without registering them it misclassifies e.g.
 * `text-body-md` as a text-*color* and drops a real color like `text-white`
 * from the same element. Register them in the `font-size` group so size and
 * color classes stop colliding.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "body-xs",
            "body-sm",
            "body-md",
            "body-lg",
            "heading-sm",
            "heading-md",
            "heading-lg",
            "heading-xl",
          ],
        },
      ],
    },
  },
});

/** Merge Tailwind class names, resolving conflicts (shadcn convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
