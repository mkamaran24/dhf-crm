import { cn } from "@/lib/utils";

interface MaterialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevation?: "sm" | "md" | "lg";
}

export function MaterialCard({ 
  children, 
  className, 
  elevation = "sm",
  ...props 
}: MaterialCardProps) {
  const shadows = {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg"
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1", 
        shadows[elevation], 
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
