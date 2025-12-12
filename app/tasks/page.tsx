
"use client";

import { useState, useEffect } from "react";
import { MaterialCard } from "@/components/MaterialCard";
import { MaterialButton } from "@/components/MaterialButton";
import { MaterialInput } from "@/components/MaterialInput";
import { MaterialSelect } from "@/components/MaterialSelect";
import { MaterialModal } from "@/components/MaterialModal";
import { Plus, CheckCircle2, Circle, Calendar, User, ArrowRight, Loader2, Tag, Link as LinkIcon } from "lucide-react";
import { Task } from "@/lib/data";

const STAFF_MEMBERS = [
  { label: "Dr. Smith", value: "Dr. Smith" },
  { label: "Sarah Wilson", value: "Sarah Wilson" },
  { label: "Nurse Joy", value: "Nurse Joy" },
  { label: "Dr. Jones", value: "Dr. Jones" },
];

const PRIORITIES = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

const RELATED_TYPES = [
  { label: "None", value: "" },
  { label: "Lead", value: "Lead" },
  { label: "Patient", value: "Patient" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "Done">("All");

  // Form State
  const [newTask, setNewTask] = useState({
    title: "",
    assignee: STAFF_MEMBERS[0].value,
    priority: "Medium",
    dueDate: "",
    relatedType: "",
    relatedName: ""
  });
  const [creating, setCreating] = useState(false);

  // Fetch Tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload: any = {
        title: newTask.title,
        assignee: newTask.assignee,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        status: "Pending"
      };

      if (newTask.relatedType && newTask.relatedName) {
        payload.relatedTo = {
          type: newTask.relatedType,
          name: newTask.relatedName
        };
      }

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewTask({
          title: "",
          assignee: STAFF_MEMBERS[0].value,
          priority: "Medium",
          dueDate: "",
          relatedType: "",
          relatedName: ""
        });
        fetchTasks();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  // Toggle Status
  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === "Pending" ? "Done" : "Pending";
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (error) {
      // Revert on error
      console.error(error);
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter(t => filterStatus === "All" || t.status === filterStatus);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50 border-red-100";
      case "Medium": return "text-amber-600 bg-amber-50 border-amber-100";
      case "Low": return "text-green-600 bg-green-50 border-green-100";
      default: return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Task Management</h1>
          <p className="text-gray-500 text-sm">Track team activities and to-dos</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
                {(["All", "Pending", "Done"] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                            filterStatus === status 
                            ? "bg-blue-50 text-blue-700 shadow-sm" 
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>
          <MaterialButton 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </MaterialButton>
        </div>
      </div>

      {/* Task Grid */}
      {loading && tasks.length === 0 ? (
         <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500">
                    No tasks found.
                </div>
            ) : (
                filteredTasks.map(task => (
                <MaterialCard key={task.id} className="group hover:border-blue-200 transition-all duration-200 cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                        </span>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleStatus(task);
                            }}
                            className={`p-1 rounded-full transition-colors ${
                                task.status === "Done" 
                                ? "text-green-600 bg-green-50 hover:bg-green-100" 
                                : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                        >
                            {task.status === "Done" ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </button>
                    </div>
                    
                    <h3 className={`font-semibold text-gray-900 mb-2 ${task.status === 'Done' ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                    </h3>

                    <div className="space-y-2">
                        <div className="flex items-center text-xs text-gray-500 gap-2">
                            <User className="w-3.5 h-3.5" />
                            <span>{task.assignee}</span>
                        </div>
                        {task.dueDate && (
                             <div className="flex items-center text-xs text-gray-500 gap-2">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                        )}
                        {task.relatedTo && (
                             <div className="flex items-center text-xs text-blue-600 gap-2 bg-blue-50/50 p-1.5 rounded-md border border-blue-50">
                                <LinkIcon className="w-3.5 h-3.5" />
                                <span className="font-medium">{task.relatedTo.type}: {task.relatedTo.name}</span>
                            </div>
                        )}
                    </div>
                </MaterialCard>
                ))
            )}
        </div>
      )}

      {/* Create Task Modal */}
      <MaterialModal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
            <MaterialInput
                label="Task Title"
                placeholder="e.g. Call patient regarding results"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                required
                autoFocus
            />
            
            <div className="grid grid-cols-2 gap-4">
                <MaterialSelect 
                    label="Assignee"
                    options={STAFF_MEMBERS}
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                />
                <MaterialSelect 
                    label="Priority"
                    options={PRIORITIES}
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                />
            </div>

            <MaterialInput
                label="Due Date"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
            />

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Related To (Optional)</h4>
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                        <MaterialSelect 
                            options={RELATED_TYPES}
                            value={newTask.relatedType}
                            onChange={(e) => setNewTask({...newTask, relatedType: e.target.value})}
                            className="bg-white"
                        />
                    </div>
                    <div className="col-span-2">
                        <MaterialInput 
                            placeholder="Name (e.g. John Doe)"
                            value={newTask.relatedName}
                            onChange={(e) => setNewTask({...newTask, relatedName: e.target.value})}
                            disabled={!newTask.relatedType}
                            className="bg-white"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-2 gap-2">
                <MaterialButton type="button" variant="text" onClick={() => setIsModalOpen(false)}>
                    Cancel
                </MaterialButton>
                <MaterialButton type="submit" disabled={creating} className="bg-blue-600 text-white hover:bg-blue-700">
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Task"}
                </MaterialButton>
            </div>
        </form>
      </MaterialModal>
    </div>
  );
}
