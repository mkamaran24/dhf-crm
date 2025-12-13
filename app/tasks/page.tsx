"use client";

import { useState } from "react";
import { Plus, Loader2, CheckCircle2, Clock, AlertTriangle, ListTodo } from "lucide-react";
import { Button, Card, CardContent } from "@/src/shared/components/ui";
import { TaskCard, CreateTaskModal, TaskFilters } from "@/src/features/tasks/components";
import { useTasks } from "@/src/features/tasks/hooks/use-tasks";

export default function TasksPage() {
  const {
    tasks,
    allTasks,
    isLoading,
    error,
    searchQuery,
    statusFilter,
    priorityFilter,
    viewMode,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    setViewMode,
    clearFilters,
    toggleTaskStatus,
    createTask,
    deleteTask,
    getPendingTasks,
    getCompletedTasks,
    getOverdueTasks,
  } = useTasks();

  const [showCreateModal, setShowCreateModal] = useState(false);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading tasks</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const pendingTasks = getPendingTasks();
  const completedTasks = getCompletedTasks();
  const overdueTasks = getOverdueTasks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks & Accountability</h1>
          <p className="text-sm text-gray-500 mt-1">Manage team tasks with clear ownership and deadlines</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Pending Tasks</p>
                <h3 className="text-3xl font-bold text-gray-900">{pendingTasks.length}</h3>
              </div>
              <div className="p-4 bg-blue-100 rounded-xl">
                <Clock className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Completed</p>
                <h3 className="text-3xl font-bold text-gray-900">{completedTasks.length}</h3>
              </div>
              <div className="p-4 bg-green-100 rounded-xl">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Overdue</p>
                <h3 className="text-3xl font-bold text-gray-900">{overdueTasks.length}</h3>
              </div>
              <div className="p-4 bg-red-100 rounded-xl">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <TaskFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        viewMode={viewMode}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onViewModeChange={setViewMode}
        onClearFilters={clearFilters}
      />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ListTodo className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-900 font-semibold mb-1">
              {searchQuery || statusFilter !== "all" || priorityFilter !== "all" 
                ? "No tasks found" 
                : "No tasks yet"}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first task to get started"}
            </p>
            {!searchQuery && statusFilter === "all" && priorityFilter === "all" && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Task
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={toggleTaskStatus}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTask={createTask}
      />
    </div>
  );
}
