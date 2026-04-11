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
import adminItems from "@/lib/admin-items";

const getPath = (fullUrl: string) => {
    try {
        return new URL(fullUrl).pathname;
    } catch {
        return fullUrl;
    }
};

export default function AdminLayout({ children }: PropsWithChildren) {
    const user = usePage().props.auth.user;
    const menuItems = adminItems();
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
            }
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
            <Sidebar>
                <SidebarHeader>
                    <Link
                        href={route("admin.dashboard")}
                        className="m-3 w-3/5 mx-auto"
                    >
                        <img src="/images/logo.png" alt="Brevet Learning System" />
                    </Link>
                </SidebarHeader>
                <SidebarContent>
                    {menuItems.map((category) => (
                        <SidebarGroup key={category.category}>
                            <SidebarGroupLabel>
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
                                                        ? "bg-primary text-accent hover:bg-primary hover:text-accent"
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
            <div className="w-full min-h-screen bg-background">
                <header className="border-b border-sidebar-border bg-sidebar">
                    <div className="mx-auto px-4">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="mr-4 space-x-2 flex items-center">
                                    <SidebarTrigger />
                                    <Link
                                        href={route("admin.dashboard")}
                                        className="block sm:hidden w-1/5"
                                    >
                                        <img
                                            src="/images/logo.png"
                                            alt="Brevet Learning System"
                                        />
                                    </Link>
                                </div>

                                <div className="hidden sm:flex sm:items-center">
                                    <h3 className="text-sm text-primary/80 font-medium">
                                        Login Terakhir :{" "}
                                        <span>
                                            {user.last_logout_at
                                                ? format(
                                                      new Date(
                                                          user.last_logout_at
                                                      ),
                                                      "dd MMM yyyy HH:mm:ss"
                                                  )
                                                : "-"}
                                        </span>
                                    </h3>
                                </div>
                            </div>

                            <div className="hidden sm:ms-6 sm:flex sm:items-center sm:gap-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex items-center hover:cursor-pointer mr-6 gap-2">
                                            <p className="font-medium">
                                                {user.name}
                                            </p>
                                            <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center text-white text-lg font-semibold">
                                                {getInitials(user.name)}
                                            </div>
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 bg-white shadow-lg rounded-lg mt-2 border border-gray-400">
                                        <DropdownMenuGroup className="p-4">
                                            <DropdownMenuLabel>
                                                <p className="text-center font-medium">
                                                    {user.name}
                                                </p>
                                            </DropdownMenuLabel>
                                            <DropdownMenuLabel>
                                                <p className="text-center font-medium text-xs text-gray-600">
                                                    {user.email}
                                                </p>
                                            </DropdownMenuLabel>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator className="bg-gray-400 h-[1px]" />
                                        <DropdownMenuGroup className="">
                                            <DropdownMenuItem>
                                                <h1
                                                    onClick={() =>
                                                        setOpenLogoutDialog(
                                                            true
                                                        )
                                                    }
                                                    className="p-2 hover:cursor-pointer text-center font-bold hover:bg-gray-100 hover:rounded-b-lg"
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
                                    <SheetContent side={"top"}>
                                        <SheetHeader>
                                            <SheetTitle>
                                                <Link
                                                    href={route(
                                                        "admin.dashboard"
                                                    )}
                                                    className="block sm:hidden w-1/5 mx-auto"
                                                >
                                                    <img
                                                        src="/images/logo.png"
                                                        alt="Brevet Learning System"
                                                    />
                                                </Link>
                                            </SheetTitle>
                                            <SheetDescription>
                                                <h2 className="text-base text-primary/80 font-medium">
                                                    {user.name}
                                                </h2>
                                                <h3 className="font-medium mb-2">
                                                    Last Login :{" "}
                                                    <span>
                                                        {user.last_logout_at
                                                            ? format(
                                                                  new Date(
                                                                      user.last_logout_at
                                                                  ),
                                                                  "dd MMM yyyy HH:mm:ss"
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

                <main>
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
