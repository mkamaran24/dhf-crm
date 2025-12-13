import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, TaskFormData } from '../types';
import { tasksService } from '../services/tasks-service';
import { TaskStatus, TaskPriority } from '@/src/shared/types';
import { useDebounce } from '@/src/shared/hooks';
import { useAuth } from '@/src/shared/contexts/auth-context';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [viewMode, setViewMode] = useState<"all" | "my">("my");

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await tasksService.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Filter by view mode (My Tasks vs All Tasks)
    if (viewMode === "my" && user) {
      filtered = filtered.filter(task => task.assignee === user.name);
    }

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(query) ||
          task.assignee.toLowerCase().includes(query) ||
          task.relatedTo?.name.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    return filtered;
  }, [tasks, viewMode, user, debouncedSearch, statusFilter, priorityFilter]);

  const toggleTaskStatus = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus: TaskStatus = task.status === 'Pending' ? 'Done' : 'Pending';
    
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));
    
    try {
      await tasksService.updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error("Error updating task:", error);
      fetchTasks();
    }
  };

  const createTask = async (data: TaskFormData) => {
    try {
      const newTask = await tasksService.createTask(data);
      setTasks([newTask, ...tasks]);
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    
    try {
      await tasksService.deleteTask(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
      fetchTasks();
    }
  };

  const getPendingTasks = () => tasks.filter(t => t.status === 'Pending');
  const getCompletedTasks = () => tasks.filter(t => t.status === 'Done');
  const getOverdueTasks = () => tasks.filter(t => 
    t.status === 'Pending' && new Date(t.dueDate) < new Date()
  );

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setViewMode("my");
  };

  // Get stats based on current view mode
  const getMyTasks = () => user ? tasks.filter(t => t.assignee === user.name) : [];
  const myPendingTasks = viewMode === "my" ? getMyTasks().filter(t => t.status === 'Pending') : getPendingTasks();
  const myCompletedTasks = viewMode === "my" ? getMyTasks().filter(t => t.status === 'Done') : getCompletedTasks();
  const myOverdueTasks = viewMode === "my" ? getMyTasks().filter(t => t.status === 'Pending' && new Date(t.dueDate) < new Date()) : getOverdueTasks();

  return {
    tasks: filteredTasks,
    allTasks: tasks,
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
    refetch: fetchTasks,
    getPendingTasks: () => viewMode === "my" ? myPendingTasks : getPendingTasks(),
    getCompletedTasks: () => viewMode === "my" ? myCompletedTasks : getCompletedTasks(),
    getOverdueTasks: () => viewMode === "my" ? myOverdueTasks : getOverdueTasks(),
  };
}
