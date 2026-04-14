import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Plus, Search, MoreVertical, Edit2, Trash2, ArrowLeft, 
  Calendar, Flag, CheckCircle2, Circle, Clock, Loader2, Filter, ChevronLeft, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import projectApi from "@/services/project.api";
import taskApi from "@/services/task.api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  status: z.enum(["todo", "in-progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().min(1, "Due date is required"),
});

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: "todo",
      priority: "medium",
    }
  });

  const fetchProjectInfo = async () => {
    const response = await projectApi.getProjectById(projectId);
    if (response.success) setProject(response.data);
    else toast.error(response.message);
  };

  const fetchTasks = async () => {
    setLoading(true);
    const params = {
      page,
      limit: 6,
      search: searchQuery,
      status: statusFilter === "all" ? undefined : statusFilter,
      priority: priorityFilter === "all" ? undefined : priorityFilter
    };
    
    const response = await taskApi.getProjectTasks(projectId, params);
    if (response.success) {
      setTasks(response.data.tasks);
      setTotalPages(response.data.pagination.totalPages);
      setTotalTasks(response.data.pagination.total);
    } else {
      toast.error(response.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjectInfo();
  }, [projectId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchTasks();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [page]);

  // Removed local filtering logic
  const filteredTasks = tasks;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    let response;
    if (editingTask) {
      response = await taskApi.updateTask(editingTask._id, data);
    } else {
      response = await taskApi.addTask(projectId, data);
    }

    if (response.success) {
      toast.success(editingTask ? "Task updated" : "Task added");
      setIsModalOpen(false);
      setEditingTask(null);
      reset();
      fetchTasks();
    } else {
      toast.error(response.message);
    }
    setIsSubmitting(false);
  };

  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    setIsSubmitting(true);
    const response = await taskApi.deleteTask(taskToDelete);
    if (response.success) {
      toast.success("Task deleted");
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchTasks();
    } else {
      toast.error(response.message);
    }
    setIsSubmitting(false);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    reset({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate.split('T')[0], // Extract YYYY-MM-DD
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    reset({ 
      title: "", 
      description: "", 
      status: "todo", 
      priority: "medium",
      dueDate: format(new Date(), "yyyy-MM-dd")
    });
    setIsModalOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-rose-500 bg-rose-500/10";
      case "medium": return "text-amber-500 bg-amber-500/10";
      case "low": return "text-emerald-500 bg-emerald-500/10";
      default: return "text-slate-500 bg-slate-500/10";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "in-progress": return <Clock className="h-5 w-5 text-amber-500 animate-pulse" />;
      default: return <Circle className="h-5 w-5 text-slate-400" />;
    }
  };

  if (loading && !project) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  return (
    <div className="space-y-10 p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-8">
        <Button 
          variant="ghost" 
          className="w-fit p-0 hover:bg-transparent text-muted-foreground hover:text-primary transition-colors gap-2 text-base"
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Projects
        </Button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Flag className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{project?.projectName}</h1>
             </div>
             <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">{project?.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button size="lg" className="h-14 px-8 shadow-xl shadow-primary/20 rounded-2xl font-bold transition-all hover:scale-105" onClick={openCreateModal}>
              <Plus className="mr-2 h-6 w-6" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center">
        <div className="relative group col-span-1 md:col-span-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search tasks..."
            className="h-12 pl-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-xl border-slate-200/60 dark:border-slate-800/60 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 col-span-1 md:col-span-2 lg:col-span-1">
           <Filter className="h-5 w-5 text-muted-foreground" />
           <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 bg-white/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 rounded-xl">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                 <SelectItem value="all">All Status</SelectItem>
                 <SelectItem value="todo">To Do</SelectItem>
                 <SelectItem value="in-progress">In Progress</SelectItem>
                 <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
           </Select>
        </div>

        <div className="flex items-center gap-4 col-span-1 md:col-span-3 lg:col-span-1">
           <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-12 bg-white/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 rounded-xl">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                 <SelectItem value="all">All Priority</SelectItem>
                 <SelectItem value="high">High</SelectItem>
                 <SelectItem value="medium">Medium</SelectItem>
                 <SelectItem value="low">Low</SelectItem>
              </SelectContent>
           </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredTasks.map((task) => (
          <Card 
            key={task._id} 
            className="group bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 hover:border-primary/40 transition-all duration-300 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary/5 h-full flex flex-col"
          >
            <CardHeader className="p-8 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                  {task.priority} Priority
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-full hover:bg-primary/10 hover:text-primary">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 p-2 rounded-2xl shadow-2xl border-slate-200 dark:border-slate-800 backdrop-blur-3xl bg-white/90 dark:bg-slate-950/90">
                    <DropdownMenuItem onClick={() => openEditModal(task)} className="rounded-xl gap-3 cursor-pointer">
                      <Edit2 className="h-4 w-4" />
                      <span>Edit Task</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteTask(task._id)} className="text-destructive focus:text-destructive rounded-xl gap-3 cursor-pointer">
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Task</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-3 mb-2">
                 {getStatusIcon(task.status)}
                 <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                    {task.title}
                 </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-8 grow">
              <p className="text-muted-foreground line-clamp-3 text-base leading-relaxed">
                {task.description}
              </p>
            </CardContent>
            <CardFooter className="p-8 pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/40">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex -space-x-2">
                 {/* Placeholder for assignees if added later */}
                 <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary">AK</div>
              </div>
            </CardFooter>
          </Card>
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="col-span-full py-24 text-center">
             <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mx-auto mb-6">
                <Plus className="h-10 w-10 text-slate-400" />
             </div>
             <h3 className="text-2xl font-bold dark:text-white">Start adding tasks</h3>
             <p className="text-muted-foreground text-lg mt-2">Organize your project by creating actionable tasks.</p>
             <Button variant="outline" className="mt-8 h-12 rounded-xl px-8" onClick={openCreateModal}>Create First Task</Button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-10 border-t border-slate-200 dark:border-slate-800">
           <p className="text-sm text-muted-foreground font-medium">
             Showing <span className="text-slate-900 dark:text-white font-bold">{tasks.length}</span> of <span className="text-slate-900 dark:text-white font-bold">{totalTasks}</span> tasks
           </p>
           <div className="flex items-center gap-2">
             <Button
               variant="outline"
               size="icon"
               className="h-10 w-10 rounded-xl"
               onClick={() => setPage(page - 1)}
               disabled={page === 1}
             >
               <ChevronLeft className="h-5 w-5" />
             </Button>
             <div className="flex items-center gap-1">
               {[...Array(totalPages)].map((_, i) => (
                 <Button
                   key={i + 1}
                   variant={page === i + 1 ? "default" : "ghost"}
                   className={`h-10 w-10 rounded-xl font-bold ${page === i + 1 ? "shadow-lg shadow-primary/25" : ""}`}
                   onClick={() => setPage(i + 1)}
                 >
                   {i + 1}
                 </Button>
               ))}
             </div>
             <Button
               variant="outline"
               size="icon"
               className="h-10 w-10 rounded-xl"
               onClick={() => setPage(page + 1)}
               disabled={page === totalPages}
             >
               <ChevronRight className="h-5 w-5" />
             </Button>
           </div>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-4xl border-slate-200 dark:border-slate-800 backdrop-blur-3xl bg-white/95 dark:bg-slate-950/95">
          <div className="p-8 pb-4">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {editingTask ? "Update Task" : "New Task"}
              </DialogTitle>
              <DialogDescription className="text-lg font-medium text-slate-500">
                {editingTask ? "Update the details of this task." : "Specify the details for your new task."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-8 max-h-[55vh] overflow-y-auto space-y-8 pb-6 custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3 col-span-2">
                  <Label className="text-sm font-bold uppercase tracking-widest text-slate-400">Task Title</Label>
                  <Input 
                    placeholder="Ex: Architect Cloud Integration" 
                    className="h-12 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-semibold"
                    {...register("title")} 
                  />
                  {errors.title && <p className="text-xs text-destructive font-bold">{errors.title.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold uppercase tracking-widest text-slate-400">Priority Level</Label>
                  <Select 
                    defaultValue="medium" 
                    onValueChange={(val) => setValue("priority", val)}
                  >
                    <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-semibold">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold uppercase tracking-widest text-slate-400">Deadline</Label>
                  <Input 
                    type="date" 
                    className="h-12 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-semibold"
                    {...register("dueDate")}
                  />
                  {errors.dueDate && <p className="text-xs text-destructive font-bold">{errors.dueDate.message}</p>}
                </div>

                <div className="space-y-3 col-span-2">
                  <Label className="text-sm font-bold uppercase tracking-widest text-slate-400">Status</Label>
                  <Select 
                    defaultValue="todo" 
                    onValueChange={(val) => setValue("status", val)}
                  >
                    <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-semibold">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 col-span-2">
                  <Label className="text-sm font-bold uppercase tracking-widest text-slate-400">Description</Label>
                  <textarea 
                    rows={4}
                    placeholder="Define the scope of work..."
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all resize-none font-medium"
                    {...register("description")}
                  />
                  {errors.description && <p className="text-xs text-destructive font-bold">{errors.description.message}</p>}
                </div>
              </div>
            </div>

            <div className="p-8 pt-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 mt-2">
              <DialogFooter className="sm:justify-start gap-4">
                <Button type="submit" size="lg" className="h-14 px-12 shadow-xl shadow-primary/20 rounded-2xl font-black transition-all hover:scale-105" disabled={isSubmitting}>
                   {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                   {editingTask ? "Update Task" : "Create Task"}
                </Button>
                <Button type="button" variant="ghost" size="lg" className="h-14 rounded-2xl font-bold text-slate-500" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Task Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-8 rounded-3xl border-slate-200 dark:border-slate-800 backdrop-blur-3xl bg-white/95 dark:bg-slate-950/95">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-destructive">Delete Task</DialogTitle>
            <DialogDescription className="text-lg mt-2">
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 gap-4 sm:justify-start">
            <Button 
              variant="destructive" 
              size="lg" 
              className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-destructive/20" 
              onClick={confirmDeleteTask}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              Confirm Delete
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="h-12 rounded-xl font-semibold" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
