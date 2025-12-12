import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export function Card({ className, children, noPadding = false, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden",
        !noPadding && "p-6",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
