import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Frontend code for Card and CardContents
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
