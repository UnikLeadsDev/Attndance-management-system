import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";

export default function AttendanceTable({ 
  records, 
  onEdit, 
  onApproveMissPunch, 
  onRejectMissPunch,
  processingIds 
}) {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Records Found</h3>
        <p className="text-gray-500">No attendance records match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <TableHead className="font-semibold text-gray-900">Date</TableHead>
              <TableHead className="font-semibold text-gray-900">Employee Name</TableHead>
              <TableHead className="font-semibold text-gray-900">Department</TableHead>
              <TableHead className="font-semibold text-gray-900">Check-in</TableHead>
              <TableHead className="font-semibold text-gray-900">Check-out</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">
                  {format(new Date(record.date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-medium text-sm">
                      {record.employee_name?.charAt(0).toUpperCase()}
                    </div>
                    {record.employee_name}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{record.department}</span>
                </TableCell>
                <TableCell>
                  {record.check_in ? (
                    <span className="text-green-600 font-medium">{record.check_in}</span>
                  ) : (
                    <span className="text-gray-400">--:--</span>
                  )}
                </TableCell>
                <TableCell>
                  {record.check_out ? (
                    <span className="text-blue-600 font-medium">{record.check_out}</span>
                  ) : (
                    <span className="text-gray-400">--:--</span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={record.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(record)}
                      className="hover:bg-indigo-50 hover:text-indigo-600"
                      disabled={processingIds.has(record.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    {record.status === 'Miss Punch' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onApproveMissPunch(record)}
                          className="hover:bg-green-50 hover:text-green-600"
                          disabled={processingIds.has(record.id)}
                        >
                          {processingIds.has(record.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRejectMissPunch(record)}
                          className="hover:bg-red-50 hover:text-red-600"
                          disabled={processingIds.has(record.id)}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}