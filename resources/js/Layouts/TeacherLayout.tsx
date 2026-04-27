import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { Button } from "@/Components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { Toaster } from "react-hot-toast";
import { Link, router, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { ChevronDown, Menu } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import teacherItems from "@/lib/teacher-items";

const getPath = (fullUrl: string) => {
    try {
        return new URL(fullUrl).pathname;
    } catch {
        return fullUrl;
    }
};

export default function TeacherLayout({ children }: PropsWithChildren) {
    const user = usePage().props.auth.user;
    const menuItems = teacherItems();
    const { url } = usePage();
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const getInitials = (name: string) => {
        const initials = name
            .split(" ")
            .map((n) => n[0])
            .join("");
        return initials.substring(0, 2).toUpperCase();
    };

    const handleLogout = () => {
        router.post(
            route("logout"),
            {},
            {
                onSuccess: () => {
                    setOpenLogoutDialog(false);
                },
            },
        );
    };

    const isActiveSidebar = (itemUrl: string) => {
        const currentPath = getPath(url);
        const itemPath = getPath(itemUrl);
        if (itemPath === "/invoice" && currentPath !== "/invoice") {
            return false;
        }
        return (
            currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
        );
    };

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "12rem",
                    "--sidebar-width-mobile": "10rem",
                } as React.CSSProperties
            }
        >
            <Sidebar className="border-r border-teal-100 bg-white/95 backdrop-blur-sm">
                <SidebarHeader className="border-b border-teal-100/70 bg-gradient-to-r from-teal-50/80 to-amber-50/70">
                    <Link
                        href={route("admin.dashboard")}
                        className="m-3 w-3/5 mx-auto"
                    >
                        <img
                            src="/images/logo.png"
                            alt="Brevet Learning System"
                        />
                    </Link>
                </SidebarHeader>
                <SidebarContent>
                    {menuItems.map((category) => (
                        <SidebarGroup key={category.category}>
                            <SidebarGroupLabel className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
                                {category.category}
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {category.items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                className={
                                                    isActiveSidebar(item.url)
                                                        ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                        : ""
                                                }
                                            >
                                                <Link href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </SidebarContent>
                <SidebarFooter />
            </Sidebar>
            <div className="relative min-h-screen w-full overflow-hidden bg-slate-50/70">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.14),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.16),_transparent_36%)]" />
                <header className="relative z-50 border-b border-teal-100 bg-gradient-to-r from-teal-50 via-white to-amber-50/90 backdrop-blur-sm">
                    <div className="mx-auto px-4">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="mr-4 space-x-2 flex items-center">
                                    <SidebarTrigger />
                                    <Link
                                        href={route("admin.dashboard")}
                                        className="block sm:hidden w-1/6"
                                    >
                                        <img
                                            src="/images/logo.png"
                                            alt="Brevet Learning System"
                                        />
                                    </Link>
                                </div>

                                <div className="hidden sm:flex sm:items-center">
                                    <h3 className="text-sm font-medium text-slate-600">
                                        Login Terakhir :{" "}
                                        <span>
                                            {user.last_logout_at
                                                ? format(
                                                      new Date(
                                                          user.last_logout_at,
                                                      ),
                                                      "dd MMM yyyy HH:mm:ss",
                                                  )
                                                : "-"}
                                        </span>
                                    </h3>
                                </div>
                            </div>

                            <div className="hidden sm:ms-6 sm:flex sm:items-center sm:gap-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="mr-6 flex items-center gap-2 rounded-xl border border-teal-100 bg-white/80 px-2 py-1 hover:cursor-pointer">
                                            <p className="font-medium text-slate-700">
                                                {user.name}
                                            </p>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 text-lg font-semibold text-white">
                                                {getInitials(user.name)}
                                            </div>
                                            <ChevronDown className="h-4 w-4 text-slate-500" />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="relative z-[100] mt-2 w-56 rounded-xl border border-teal-100 bg-white/95 shadow-lg backdrop-blur-sm">
                                        <DropdownMenuGroup className="p-4">
                                            <DropdownMenuLabel>
                                                <p className="text-center font-medium">
                                                    {user.name}
                                                </p>
                                            </DropdownMenuLabel>
                                            <DropdownMenuLabel>
                                                <p className="text-center text-xs font-medium text-slate-500">
                                                    {user.email}
                                                </p>
                                            </DropdownMenuLabel>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator className="h-[1px] bg-teal-100" />
                                        <DropdownMenuGroup className="">
                                            <DropdownMenuItem>
                                                <h1
                                                    onClick={() =>
                                                        setOpenLogoutDialog(
                                                            true,
                                                        )
                                                    }
                                                    className="rounded-b-lg p-2 text-center font-bold text-slate-700 hover:cursor-pointer hover:bg-teal-50"
                                                >
                                                    Logout
                                                </h1>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex items-center sm:hidden">
                                <Sheet>
                                    <SheetTrigger>
                                        <Menu />
                                    </SheetTrigger>
                                    <SheetContent
                                        side={"top"}
                                        className="border-teal-100 bg-gradient-to-br from-white via-teal-50/70 to-amber-50/70"
                                    >
                                        <SheetHeader>
                                            <SheetTitle>
                                                <Link
                                                    href={route(
                                                        "admin.dashboard",
                                                    )}
                                                    className="block sm:hidden w-1/6 mx-auto"
                                                >
                                                    <img
                                                        src="/images/logo.png"
                                                        alt="Brevet Learning System"
                                                    />
                                                </Link>
                                            </SheetTitle>
                                            <SheetDescription className="text-slate-600">
                                                <h2 className="text-base font-medium text-slate-700">
                                                    {user.name}
                                                </h2>
                                                <h3 className="font-medium mb-2">
                                                    Last Login :{" "}
                                                    <span>
                                                        {user.last_logout_at
                                                            ? format(
                                                                  new Date(
                                                                      user.last_logout_at,
                                                                  ),
                                                                  "dd MMM yyyy HH:mm:ss",
                                                              )
                                                            : "-"}
                                                    </span>
                                                </h3>
                                                <Button asChild>
                                                    <Link
                                                        href={route("logout")}
                                                        method="post"
                                                        as="button"
                                                    >
                                                        Log Out
                                                    </Link>
                                                </Button>
                                            </SheetDescription>
                                        </SheetHeader>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="relative z-10">
                    <Toaster position="top-center" />
                    {children}
                </main>
            </div>
            <ConfirmDialog
                open={openLogoutDialog}
                onClose={() => setOpenLogoutDialog(false)}
                onConfirm={handleLogout}
                title="Log Out"
                description="Apakah Anda yakin ingin logout?"
            />
        </SidebarProvider>
    );
}
