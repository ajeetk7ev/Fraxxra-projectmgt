import { useEffect, useState } from "react";
import { Plus, Search, MoreVertical, Edit2, Trash2, Folder, ExternalLink, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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
import projectApi from "@/services/project.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const projectSchema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  const fetchProjects = async () => {
    setLoading(true);
    const response = await projectApi.getAllProjects({ 
      page, 
      search: searchQuery 
    });
    if (response.success) {
      setProjects(response.data.projects);
      setTotalPages(response.data.pagination.totalPages);
      setTotalProjects(response.data.pagination.total);
    } else {
      toast.error(response.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to first page on new search
      fetchProjects();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchProjects();
  }, [page]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    let response;
    if (editingProject) {
      response = await projectApi.updateProject(editingProject._id, data);
    } else {
      response = await projectApi.createProject(data);
    }

    if (response.success) {
      toast.success(editingProject ? "Project updated" : "Project created");
      setIsModalOpen(false);
      setEditingProject(null);
      reset();
      fetchProjects();
    } else {
      toast.error(response.message);
    }
    setIsSubmitting(false);
  };

  const handleDelete = (projectId) => {
    setProjectToDelete(projectId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setIsSubmitting(true);
    const response = await projectApi.deleteProject(projectToDelete);
    if (response.success) {
      toast.success("Project deleted");
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
      fetchProjects();
    } else {
      toast.error(response.message);
    }
    setIsSubmitting(false);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    reset({
      projectName: project.projectName,
      description: project.description,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    reset({ projectName: "", description: "" });
    setIsModalOpen(true);
  };

  // Removed local filtering as we use API-side filtering
  const filteredProjects = projects;

  return (
    <div className="space-y-8 p-6 lg:p-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Projects</h1>
          <p className="text-muted-foreground text-lg">Manage and build your project ecosystem.</p>
        </div>
        <Button size="lg" className="h-12 px-6 shadow-xl shadow-primary/20 transition-all hover:scale-105" onClick={openCreateModal}>
          <Plus className="mr-2 h-5 w-5" />
          Create New Project
        </Button>
      </div>

      <div className="relative group max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Search projects by name..."
          className="h-14 pl-12 pr-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-lg rounded-2xl ring-offset-background group-focus-within:ring-2 group-focus-within:ring-primary shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card 
              key={project._id} 
              className="group relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden rounded-3xl"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-full">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 p-2 rounded-2xl shadow-2xl border-slate-200 dark:border-slate-800 backdrop-blur-3xl bg-white/90 dark:bg-slate-950/90">
                    <DropdownMenuItem onClick={() => openEditModal(project)} className="rounded-xl gap-3 cursor-pointer py-2.5">
                      <Edit2 className="h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(project._id)} className="text-destructive focus:text-destructive rounded-xl gap-3 cursor-pointer py-2.5">
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardHeader className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Folder className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                  {project.projectName}
                </CardTitle>
                <CardDescription className="text-base line-clamp-3 mt-3 leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="px-8 pb-8 pt-0 mt-auto">
                <Button 
                  variant="secondary" 
                  className="w-full h-12 bg-slate-100 dark:bg-slate-800/50 hover:bg-primary hover:text-white transition-all duration-300 rounded-2xl font-semibold gap-2"
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  <ExternalLink className="h-4 w-4" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {filteredProjects.length === 0 && (
             <div className="col-span-full py-20 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mx-auto mb-6">
                  <Folder className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold dark:text-white">No projects found</h3>
                <p className="text-muted-foreground text-lg">Try searching with a different name or create a new one.</p>
                <Button variant="outline" className="mt-4 rounded-xl px-8 h-12" onClick={openCreateModal}>Create Project</Button>
             </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-bold text-slate-900 dark:text-white">{projects.length}</span> of <span className="font-bold text-slate-900 dark:text-white">{totalProjects}</span> projects
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

      {/* Modal for Create/Edit project */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-3xl border-slate-200 dark:border-slate-800 backdrop-blur-3xl bg-white/95 dark:bg-slate-950/95">
          <div className="p-8 pb-4">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">
                {editingProject ? "Update Project" : "Create Project"}
              </DialogTitle>
              <DialogDescription className="text-lg">
                {editingProject ? "Edit the details of your existing project." : "Define a new project to start tracking tasks."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-8 max-h-[60vh] overflow-y-auto space-y-6 pb-4 custom-scrollbar">
              <div className="space-y-3">
                <Label htmlFor="projectName" className="text-base font-semibold">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="Ex: SaaS Platform Revamp"
                  className="h-12 bg-white/50 dark:bg-slate-900/50 rounded-xl"
                  {...register("projectName")}
                />
                {errors.projectName && (
                  <p className="text-sm text-destructive">{errors.projectName.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                <textarea
                  id="description"
                  rows={5}
                  placeholder="Briefly describe the project goals and objectives..."
                  className="w-full p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-input focus:ring-2 focus:ring-primary outline-none transition-all resize-none text-base"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>
            </div>

            <div className="p-8 pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <DialogFooter className="sm:justify-start gap-4">
                <Button type="submit" size="lg" className="h-12 px-10 shadow-lg shadow-primary/20 rounded-xl font-bold" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                  {editingProject ? "Save Changes" : "Confirm & Create"}
                </Button>
                <Button type="button" variant="ghost" size="lg" className="h-12 rounded-xl font-semibold" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-8 rounded-3xl border-slate-200 dark:border-slate-800 backdrop-blur-3xl bg-white/95 dark:bg-slate-950/95">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-destructive">Delete Project</DialogTitle>
            <DialogDescription className="text-lg mt-2">
              Are you sure you want to delete this project? This action cannot be undone and all associated tasks will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 gap-4 sm:justify-start">
            <Button 
              variant="destructive" 
              size="lg" 
              className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-destructive/20" 
              onClick={confirmDelete}
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
