import React from "react";

/**
 * Table wrapper component with horizontal scroll support
 * Provides container for the table with overflow handling
 * 
 * @example
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Column 1</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Data 1</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 */
export function Table({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse" aria-label="Tabla de empresas SaaS">
        {children}
      </table>
    </div>
  );
}

/**
 * Table header component
 * Styled with background color and sticky positioning
 */
export function TableHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <thead
      className={`bg-gray-50 sticky top-0 z-10 ${className}`}
    >
      {children}
    </thead>
  );
}

/**
 * Table body component
 * Container for table rows
 */
export function TableBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <tbody className={className}>{children}</tbody>;
}

/**
 * Table row component
 * Includes hover effect for better UX
 */
export function TableRow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={`
        border-b border-gray-200 
        hover:bg-gray-50 
        transition-colors
        ${className}
      `.trim().replace(/\s+/g, " ")}
    >
      {children}
    </tr>
  );
}

/**
 * Table header cell component
 * Styled for column headers with proper alignment and typography
 */
export function TableHead({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`
        px-6 py-3 
        text-left text-xs font-medium 
        text-gray-500 uppercase tracking-wider
        ${className}
      `.trim().replace(/\s+/g, " ")}
    >
      {children}
    </th>
  );
}

/**
 * Table data cell component
 * Styled for table data with proper padding and alignment
 */
export function TableCell({
  children,
  className = "",
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <td
      className={`
        px-6 py-4 
        text-sm text-gray-900
        ${alignmentClasses[align]}
        ${className}
      `.trim().replace(/\s+/g, " ")}
    >
      {children}
    </td>
  );
}
