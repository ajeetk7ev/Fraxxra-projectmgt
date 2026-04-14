import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import projectApi from "@/services/project.api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Folder } from "lucide-react";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const res = await projectApi.getAllProjects({ limit: 3 });
      if (res.success) {
        setProjects(res.data.projects);
      }
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    dispatch(clearUser());
    navigate("/signin");
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
                <p className="text-slate-500 text-lg">Your workspace overview.</p>
              </div>
              <Button 
                onClick={() => navigate("/projects")}
                className="h-14 px-8 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all gap-2"
              >
                <Plus size={20} />
                New Project
              </Button>
            </div>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold dark:text-white">Active Projects</h2>
                  <Button variant="link" className="text-primary font-bold" onClick={() => navigate("/projects")}>View all</Button>
                </div>
                
                <div className="grid gap-6">
                  {loading ? (
                    [1,2].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-3xl" />)
                  ) : projects.length > 0 ? (
                    projects.map(project => (
                      <Card 
                        key={project._id} 
                        className="group bg-white dark:bg-slate-900 border-none shadow-sm hover:shadow-xl hover:shadow-primary/5 cursor-pointer transition-all rounded-3xl"
                        onClick={() => navigate(`/projects/${project._id}`)}
                      >
                        <CardHeader className="flex flex-row items-center gap-6 p-6">
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Folder size={28} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{project.projectName}</CardTitle>
                            <CardDescription className="line-clamp-1 mt-1 text-slate-500 font-medium">{project.description}</CardDescription>
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <Plus size={20} className="text-slate-400" />
                          </Button>
                        </CardHeader>
                      </Card>
                    ))
                  ) : (
                    <Card className="border-dashed border-2 bg-transparent text-center py-12 rounded-3xl">
                      <p className="text-slate-500 font-medium">No projects initiated yet.</p>
                      <Button variant="link" onClick={() => navigate("/projects")}>Create your first project</Button>
                    </Card>
                  )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
