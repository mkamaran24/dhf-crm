"use client";

import { useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter, Button, Input, Select } from "@/src/shared/components/ui";
import { Save } from "lucide-react";
import { TaskFormData } from "../types";
import { TASK_PRIORITIES } from "@/src/shared/constants";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (data: TaskFormData) => Promise<void>;
}

const STAFF_MEMBERS = [
  { label: "Sarah Wilson", value: "Sarah Wilson" },
  { label: "Dr. Smith", value: "Dr. Smith" },
  { label: "Dr. Jones", value: "Dr. Jones" },
  { label: "Dr. Emily Brown", value: "Dr. Emily Brown" },
  { label: "Nurse Joy", value: "Nurse Joy" },
];

const RELATED_TYPES = [
  { label: "None", value: "" },
  { label: "Lead", value: "Lead" },
  { label: "Patient", value: "Patient" },
];

export function CreateTaskModal({ isOpen, onClose, onCreateTask }: CreateTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    assignee: STAFF_MEMBERS[0].value,
    priority: "Medium",
    dueDate: "",
    relatedTo: undefined,
  });
  const [relatedType, setRelatedType] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onCreateTask(formData);
      setFormData({
        title: "",
        assignee: STAFF_MEMBERS[0].value,
        priority: "Medium",
        dueDate: "",
        relatedTo: undefined,
      });
      setRelatedType("");
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const priorityOptions = TASK_PRIORITIES.map(p => ({ label: p, value: p }));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
          <p className="text-sm text-gray-500 mt-1">Assign a task to a team member</p>
        </ModalHeader>

        <ModalContent>
          <div className="space-y-6">
            <Input
              label="Task Title"
              name="title"
              placeholder="e.g., Follow up with lead about consultation"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Assign To"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                options={STAFF_MEMBERS}
              />

              <Select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                options={priorityOptions}
              />
            </div>

            <Input
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />

            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900">Link to Lead or Patient (Optional)</h4>
              
              <Select
                label="Related Type"
                value={relatedType}
                onChange={(e) => {
                  setRelatedType(e.target.value);
                  if (!e.target.value) {
                    setFormData(prev => ({ ...prev, relatedTo: undefined }));
                  }
                }}
                options={RELATED_TYPES}
              />

              {relatedType && (
                <Input
                  label={`${relatedType} Name`}
                  placeholder={`Enter ${relatedType.toLowerCase()} name`}
                  value={formData.relatedTo?.name || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    relatedTo: {
                      type: relatedType as 'Lead' | 'Patient',
                      name: e.target.value,
                    }
                  }))}
                />
              )}
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <Button
            type="button"
            variant="outlined"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

