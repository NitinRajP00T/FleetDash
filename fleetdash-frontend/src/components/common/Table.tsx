import React from 'react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyText?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyText = 'No data available',
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100 dark:border-dark-800 bg-white dark:bg-dark-900 shadow-2xs">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50/80 dark:bg-dark-800/60 border-b border-gray-100 dark:border-dark-800 text-gray-500 dark:text-gray-400 font-semibold text-xs uppercase tracking-wider">
            {columns.map((col, idx) => (
              <th key={idx} className={`px-4 py-3.5 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-dark-800/60">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, rIdx) => (
              <tr key={rIdx} className="animate-pulse">
                {columns.map((_, cIdx) => (
                  <td key={cIdx} className="px-4 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-dark-800 rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500 text-sm font-medium">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => (
              <tr
                key={row._id || row.id || rIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors duration-150 ${
                  onRowClick ? 'cursor-pointer hover:bg-gray-50/80 dark:hover:bg-dark-800/50' : 'hover:bg-gray-50/50 dark:hover:bg-dark-800/30'
                }`}
              >
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className={`px-4 py-3.5 text-gray-800 dark:text-gray-200 ${col.className || ''}`}>
                    {col.cell
                      ? col.cell(row)
                      : col.accessorKey
                      ? String(row[col.accessorKey] ?? '')
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
