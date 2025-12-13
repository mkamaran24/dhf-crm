import { cn } from "@/src/shared/lib/utils";
import { TableHTMLAttributes } from "react";

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  headers: string[];
  children: React.ReactNode;
}

export function Table({ headers, children, className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
      <div className="overflow-x-auto">
        <table className={cn("w-full text-left text-sm", className)} {...props}>
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {headers.map((header) => (
                <th 
                  key={header} 
                  className="px-6 py-4 font-semibold text-gray-600 tracking-wide uppercase text-xs"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 [&_tr]:transition-colors [&_tr]:hover:bg-gray-50/80">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

