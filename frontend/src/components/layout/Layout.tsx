import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Package, Star, AlertTriangle,
    Menu, ChevronRight, Moon, Sun, Box, Bell
} from 'lucide-react';
import { cn } from '../../utils';
import { useLowStockAlert } from '../../hooks/useLowStockAlert';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', description: 'Overview & stats' },
    { icon: Package, label: 'Products', path: '/products', description: 'Manage catalog' },
    { icon: Star, label: 'Featured', path: '/featured', description: 'Highlighted items' },
    { icon: AlertTriangle, label: 'Low Stock', path: '/low-stock', description: 'Restock alerts', isAlert: true },
];

function useDarkMode() {
    const [dark, setDark] = useState(() => {
        const stored = localStorage.getItem('theme');
        if (stored) return stored === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (dark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [dark]);

    return [dark, setDark] as const;
}

const Sidebar = ({
    isOpen,
    setIsOpen,
    lowStockCount,
}: {
    isOpen: boolean;
    setIsOpen: (o: boolean) => void;
    lowStockCount: number;
}) => {
    const location = useLocation();
    const [dark, setDark] = useDarkMode();

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-20 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-30 flex w-64 flex-col",
                "bg-[hsl(var(--sidebar))] border-r border-white/5",
                "transform transition-transform duration-300 ease-in-out",
                "lg:translate-x-0 lg:static lg:inset-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo */}
                <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                        <Box className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <span className="text-base font-bold text-white">ProductCatalog</span>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Admin</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                        Navigation
                    </p>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/' && location.pathname.startsWith(item.path));
                        const showBadge = item.isAlert && lowStockCount > 0;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-white/10 text-white shadow-sm"
                                        : "text-white/50 hover:bg-white/5 hover:text-white/80"
                                )}
                            >
                                <div className={cn(
                                    "relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md transition-all duration-200",
                                    isActive
                                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                                        : showBadge
                                            ? "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20"
                                            : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/60"
                                )}>
                                    <Icon className="h-4 w-4" />
                                    {/* Pulsing dot on icon when low stock */}
                                    {showBadge && !isActive && (
                                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="truncate">{item.label}</div>
                                    <div className={cn(
                                        "text-[10px] truncate transition-colors",
                                        isActive ? "text-white/50" : "text-white/30 group-hover:text-white/40"
                                    )}>
                                        {item.description}
                                    </div>
                                </div>
                                {/* Badge count */}
                                {showBadge && (
                                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white shadow-sm shadow-amber-500/50">
                                        {lowStockCount > 99 ? '99+' : lowStockCount}
                                    </span>
                                )}
                                {isActive && !showBadge && <ChevronRight className="h-3.5 w-3.5 text-white/40 flex-shrink-0" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t border-white/5 p-3 space-y-2">
                    <button
                        onClick={() => setDark(!dark)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 transition-all hover:bg-white/5 hover:text-white/80"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5">
                            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </div>
                        <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <div className="px-3 text-[10px] text-white/20">
                        Product Catalog v1.0 · Spring Boot + React
                    </div>
                </div>
            </aside>
        </>
    );
};

export const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Global low stock polling — fires toast + returns count for badge
    const lowStockCount = useLowStockAlert();

    const currentPage = menuItems.find(
        item => item.path === location.pathname ||
            (item.path !== '/' && location.pathname.startsWith(item.path))
    );

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} lowStockCount={lowStockCount} />

            <div className="flex flex-1 flex-col overflow-hidden min-w-0">
                {/* Top header */}
                <header className="flex h-14 items-center gap-4 border-b border-border bg-card/50 backdrop-blur-sm px-4 lg:px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-muted-foreground hover:text-foreground transition-colors lg:hidden focus:outline-none"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{currentPage?.label || 'Dashboard'}</span>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Low stock bell in header */}
                    {lowStockCount > 0 && (
                        <Link
                            to="/low-stock"
                            className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors border border-amber-500/20"
                            title={`${lowStockCount} low stock alert${lowStockCount !== 1 ? 's' : ''}`}
                        >
                            <Bell className="h-4 w-4" />
                            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                                {lowStockCount > 99 ? '99+' : lowStockCount}
                            </span>
                        </Link>
                    )}
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8 animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
