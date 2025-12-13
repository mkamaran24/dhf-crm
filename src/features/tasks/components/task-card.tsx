"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Calendar, 
  User, 
  AlertCircle,
  Flag,
  ExternalLink
} from "lucide-react";
import { Task } from "../types";
import { Badge } from "@/src/shared/components/ui";
import { DeleteConfirmationModal } from "@/src/shared/components/ui";

interface TaskCardProps {
  task: Task;
  onToggleStatus: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

function getPriorityConfig(priority: string) {
  switch (priority) {
    case "High":
      return { variant: "error" as const, color: "text-red-600", bgColor: "bg-red-50" };
    case "Medium":
      return { variant: "warning" as const, color: "text-yellow-600", bgColor: "bg-yellow-50" };
    default:
      return { variant: "default" as const, color: "text-blue-600", bgColor: "bg-blue-50" };
  }
}

function isOverdue(dueDate: string, status: string): boolean {
  return status === 'Pending' && new Date(dueDate) < new Date();
}

function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function TaskCard({ task, onToggleStatus, onDelete }: TaskCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const priorityConfig = getPriorityConfig(task.priority);
  const overdue = isOverdue(task.dueDate, task.status);
  const isDone = task.status === 'Done';

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        className={`group bg-white border-2 rounded-xl p-5 transition-all duration-200 ${
          isDone
            ? 'border-gray-200 bg-gray-50/50'
            : overdue
            ? 'border-red-200 bg-red-50/30 shadow-md shadow-red-100'
            : 'border-gray-200 hover:shadow-lg hover:border-blue-300'
        }`}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={() => onToggleStatus(task.id)}
            className={`mt-0.5 flex-shrink-0 transition-all duration-200 ${
              isDone
                ? 'text-green-600 hover:text-green-700'
                : 'text-gray-300 hover:text-blue-600 hover:scale-110'
            }`}
          >
            {isDone ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className={`font-semibold text-gray-900 text-base leading-snug ${
                isDone ? 'line-through text-gray-500' : ''
              }`}>
                {task.title}
              </h3>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{task.assignee}</span>
              </div>

              <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg font-medium ${
                overdue
                  ? 'text-red-700 bg-red-100 border border-red-200'
                  : 'text-gray-600 bg-gray-50'
              }`}>
                {overdue ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Calendar className="w-4 h-4 text-gray-500" />
                )}
                <span>{formatDueDate(task.dueDate)}</span>
                {overdue && <span className="text-xs font-bold">OVERDUE</span>}
              </div>

              <Badge 
                variant={priorityConfig.variant}
                className="flex items-center gap-1.5 font-semibold"
              >
                <Flag className="w-3.5 h-3.5" />
                {task.priority}
              </Badge>
            </div>

            {task.relatedTo && (
              <Link
                href={`/${task.relatedTo.type.toLowerCase()}s/${task.relatedTo.id}`}
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors font-medium border border-blue-200"
              >
                <span>Related: {task.relatedTo.type} - {task.relatedTo.name}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        itemName={`task "${task.title}"`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}

