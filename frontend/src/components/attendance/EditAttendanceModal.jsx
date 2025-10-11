import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Save } from "lucide-react";

export default function EditAttendanceModal({ isOpen, onClose, attendance, onSave }) {
  const [formData, setFormData] = useState({
    check_in: '',
    check_out: '',
    status: 'Present',
    notes: ''
  });

  useEffect(() => {
    if (attendance) {
      setFormData({
        check_in: attendance.check_in || '',
        check_out: attendance.check_out || '',
        status: attendance.status || 'Present',
        notes: attendance.notes || ''
      });
    }
  }, [attendance]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!attendance) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Clock className="w-5 h-5 text-indigo-600" />
            Edit Attendance
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            {attendance.employee_name} - {attendance.date}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="check_in">Check-in Time</Label>
              <Input
                id="check_in"
                type="time"
                value={formData.check_in}
                onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="check_out">Check-out Time</Label>
              <Input
                id="check_out"
                type="time"
                value={formData.check_out}
                onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Miss Punch">Miss Punch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}