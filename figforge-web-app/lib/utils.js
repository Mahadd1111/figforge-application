import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const downloadFile = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain' });

  const link = document.createElement('a');
  link.download = filename;
  link.href = URL.createObjectURL(blob);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
