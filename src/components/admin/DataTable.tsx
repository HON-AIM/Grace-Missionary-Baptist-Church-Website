"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from "react-icons/hi";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  basePath: string;
  onDelete?: (id: string) => void;
  createLabel?: string;
}

export default function DataTable({
  columns,
  data,
  basePath,
  onDelete,
  createLabel = "Add New",
}: DataTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-navy-800 border border-navy-700/50 rounded-xl overflow-hidden"
    >
      <div className="p-4 border-b border-navy-700/50 flex items-center justify-between">
        <div className="flex-1" />
        <Link
          href={`${basePath}/new`}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-900 rounded-lg text-sm font-medium hover:bg-gold-400 transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" />
          <span>{createLabel}</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-navy-700/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 text-navy-400 text-xs font-medium uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              <th className="text-right px-4 py-3 text-navy-400 text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-12 text-navy-500"
                >
                  No items found
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-navy-700/30 hover:bg-navy-700/30 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-navy-200">
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`${basePath}/${row.id}/edit`}
                        className="p-2 text-navy-400 hover:text-gold-500 hover:bg-navy-700/50 rounded-lg transition-all"
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </Link>
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row.id)}
                          className="p-2 text-navy-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
