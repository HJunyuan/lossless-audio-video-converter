import { twMerge } from "tailwind-merge";

interface InlineCodeProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {}

export function InlineCode({ children, className, ...rest }: InlineCodeProps) {
  return (
    <code
      className={twMerge(
        "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs ring-1 ring-gray-500/10 ring-inset",
        className,
      )}
      {...rest}
    >
      {children}
    </code>
  );
}
