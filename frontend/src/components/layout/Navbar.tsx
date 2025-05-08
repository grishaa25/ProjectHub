
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui-custom/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserCircle, LogOut } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userRole, userName, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleRoleChange = (newRole: string) => {
    switch(newRole) {
      case 'admin':
        navigate('/admin');
        break;
      case 'professor':
        navigate('/professor');
        break;
      case 'student':
        navigate('/dashboard');
        break;
      default:
        navigate('/login');
    }
  };

  // Navbar links based on user role
  const renderNavLinks = () => {
    if (!isAuthenticated) {
      // Not logged in - no special links
      return null;
    }

    return (
      <ul className="flex items-center space-x-8">
        {userRole === 'admin' && (
          <li>
            <Link
              to="/admin"
              className={cn(
                "relative font-medium text-sm transition-colors duration-200",
                isActive("/admin")
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground"
              )}
            >
              Dashboard
              {isActive("/admin") && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          </li>
        )}
        
        {userRole === 'professor' && (
          <li>
            <Link
              to="/professor"
              className={cn(
                "relative font-medium text-sm transition-colors duration-200",
                isActive("/professor")
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground"
              )}
            >
              Dashboard
              {isActive("/professor") && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          </li>
        )}
        
        {userRole === 'student' && (
          <li>
            <Link
              to="/dashboard"
              className={cn(
                "relative font-medium text-sm transition-colors duration-200",
                isActive("/dashboard")
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground"
              )}
            >
              Dashboard
              {isActive("/dashboard") && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          </li>
        )}
      </ul>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "py-3 bg-white/70 dark:bg-dark-background/70 backdrop-blur-lg shadow-sm"
          : "py-5 bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link to={isAuthenticated ? `/${userRole === 'student' ? 'dashboard' : userRole}` : "/"} className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl">ProjectHub</span>
            <span className="text-xs text-muted-foreground">Collaborate, Contribute, Create</span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {renderNavLinks()}
          <div className="flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    <span>{userName || userRole}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    Signed in as {userName}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Switch Roles</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleRoleChange('student')}>
                    Student Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleChange('professor')}>
                    Professor Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleChange('admin')}>
                    Admin Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden absolute w-full bg-background/95 dark:bg-dark-background/95 backdrop-blur-lg border-b border-border transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "max-h-96 py-4 shadow-lg" : "max-h-0 py-0 overflow-hidden border-none"
        )}
      >
        <div className="container flex flex-col space-y-4">
          {isAuthenticated ? (
            <>
              <div className="py-2 border-b border-border">
                <div className="font-medium">Hello, {userName || "User"}</div>
                <div className="text-sm text-muted-foreground capitalize">Role: {userRole}</div>
              </div>
              <ul className="flex flex-col space-y-4">
                <li>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => handleRoleChange('student')}>
                    Student Dashboard
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => handleRoleChange('professor')}>
                    Professor Dashboard
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => handleRoleChange('admin')}>
                    Admin Dashboard
                  </Button>
                </li>
              </ul>
              <div className="pt-2 border-t border-border">
                <Button variant="outline" className="w-full" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-2 pt-2 border-t border-border">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
