import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { clearUser } from "@/store/slices/authSlice";
import authApi from "@/services/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, LayoutDashboard, User as UserIcon, Folder, Plus } from "lucide-react";
import Logo from "@/assets/fraxxra.png";

export default function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await authApi.logout();
    dispatch(clearUser());
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans">
      <header className="sticky top-0 z-30 w-full border-b bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 h-10 cursor-pointer" onClick={() => navigate("/dashboard")}>
                <img src={Logo} alt="Fraxxra Logo" className="h-8 w-auto" />
                <span className="text-xl font-black tracking-tight text-primary">FRAXXRA</span>
              </div>
              
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 pl-2 group cursor-pointer bg-slate-50 dark:bg-slate-800/50 p-1.5 pr-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-black shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                  {user?.name 
                    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                    : <UserIcon size={18} />
                  }
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-bold leading-none text-slate-900 dark:text-white">{user?.name || "User"}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1 font-bold">System Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto flex h-[calc(100vh-64px)] overflow-hidden">
        <aside className="hidden lg:flex w-72 flex-col border-r p-8 space-y-10 bg-white dark:bg-slate-900 overflow-y-auto">
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 px-4 mb-4">Workspace</p>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-4 h-12 px-4 rounded-2xl text-base font-semibold transition-all ${location.pathname === "/dashboard" ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
              onClick={() => navigate("/dashboard")}
            >
              <LayoutDashboard size={20} />
              Overview
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-4 h-12 px-4 rounded-2xl text-base font-semibold transition-all ${location.pathname.startsWith("/projects") ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
              onClick={() => navigate("/projects")}
            >
              <Folder size={20} />
              Projects
            </Button>
          </div>

          <div className="mt-auto">
             <Button 
               variant="ghost" 
               className="w-full justify-start gap-4 h-12 px-4 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold" 
               onClick={handleLogout}
             >
              <LogOut size={20} />
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
