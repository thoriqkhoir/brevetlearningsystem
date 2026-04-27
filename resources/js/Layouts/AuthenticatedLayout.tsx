import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { Button } from "@/Components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/Components/ui/navigation-menu";
import { Separator } from "@/Components/ui/separator";
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
import items from "@/lib/sidebar-items";
import { Link, router, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { ChevronDown, LogOut, Menu } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";

const getPath = (fullUrl: string) => {
    try {
        return new URL(fullUrl).pathname;
    } catch {
        return fullUrl;
    }
};

export default function Authenticated({ children }: PropsWithChildren) {
    const pageProps = usePage().props as any;
    const user = pageProps.auth.user;
    const active_course = usePage().props.active_course as {
        id: number;
        name: string;
        access_rights: string[];
    } | null;
    const businessEntities = (pageProps.business_entities ?? []) as Array<{
        id: string;
        name: string;
        npwp: string;
    }>;
    const activeBusinessEntity = (pageProps.active_business_entity ?? null) as {
        id: string;
        name: string;
        npwp: string;
    } | null;
    const access_rights =
        active_course && active_course.access_rights
            ? Array.isArray(active_course.access_rights)
                ? active_course.access_rights
                : JSON.parse(active_course.access_rights)
            : user.access_rights;
    const menuItems = items();
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

        if (
            currentPath.match(/^\/bpa1\/(not-issued\/)?[^\/]+\/(detail|edit)$/)
        ) {
            const pageProps = usePage().props as any;
            const bupot = pageProps.bupot;

            if (bupot) {
                if (
                    bupot.status === "approved" &&
                    itemPath === "/bpa1/issued"
                ) {
                    return true;
                }
                if (bupot.status === "draft" && itemPath === "/bpa1/invalid") {
                    return true;
                }
                if (
                    (bupot.status === "created" || !bupot.status) &&
                    (itemPath === "/bpa1" || itemPath === "/bpa1/not-issued")
                ) {
                    return true;
                }
            }
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
                        href={route("dashboard")}
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
                <header className="border-b border-teal-100 bg-gradient-to-r from-teal-50 via-white to-amber-50/90 backdrop-blur-sm">
                    <div className="mx-auto px-4">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="mr-4 space-x-2 flex items-center">
                                    <SidebarTrigger />
                                    <Link
                                        href={route("dashboard")}
                                        className="block md:hidden w-20"
                                    >
                                        <img
                                            src="/images/logo.png"
                                            alt="Brevet Learning System"
                                        />
                                    </Link>
                                </div>

                                <div className="hidden md:flex md:items-center">
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
                            {active_course && (
                                <div className="my-2 ml-8 flex items-center rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 text-center text-sm font-semibold text-emerald-700">
                                    Kelas Aktif: {active_course.name}
                                    <Button
                                        size="sm"
                                        className="ml-4"
                                        variant="accentOutline"
                                        onClick={() =>
                                            router.post(route("courses.stop"))
                                        }
                                    >
                                        Berhenti
                                    </Button>
                                </div>
                            )}

                            <div className="hidden lg:ms-6 lg:flex lg:items-center lg:gap-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="mr-6 flex items-center gap-2 rounded-xl border border-teal-100 bg-white/80 px-2 py-1 hover:cursor-pointer">
                                            <div>
                                                {activeBusinessEntity &&
                                                activeBusinessEntity.id !==
                                                    user.id ? (
                                                    <p className="text-center text-xs font-medium text-slate-500">
                                                        You are currently
                                                        impersonating user
                                                    </p>
                                                ) : null}
                                                <p className="text-center font-medium text-slate-700">
                                                    {activeBusinessEntity
                                                        ? ` ${activeBusinessEntity.npwp} ${activeBusinessEntity.name}`
                                                        : `${user.npwp} ${user.name}`}
                                                </p>
                                            </div>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 text-lg font-semibold text-white">
                                                {getInitials(
                                                    activeBusinessEntity
                                                        ? activeBusinessEntity.name
                                                        : user.name,
                                                )}
                                            </div>
                                            <ChevronDown className="h-4 w-4 text-slate-500" />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="z-50 mt-2 w-96 rounded-xl border border-teal-100 bg-white/95 shadow-lg backdrop-blur-sm">
                                        <DropdownMenuGroup className="p-2">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    router.post(
                                                        route(
                                                            "impersonate.personal",
                                                        ),
                                                    )
                                                }
                                            >
                                                <p className="w-full cursor-pointer rounded-lg p-2 text-center hover:bg-teal-50">
                                                    {user.npwp} {user.name}
                                                </p>
                                            </DropdownMenuItem>

                                            {businessEntities.map((e) => (
                                                <DropdownMenuItem
                                                    key={e.id}
                                                    onClick={() =>
                                                        router.post(
                                                            route(
                                                                "impersonate.business",
                                                                e.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    <p className="w-full cursor-pointer rounded-lg p-2 text-center hover:bg-teal-50">
                                                        {e.npwp} {e.name}
                                                    </p>
                                                </DropdownMenuItem>
                                            ))}

                                            <DropdownMenuSeparator className="my-2 h-[1px] bg-teal-100" />

                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={route(
                                                        "business-entities.create",
                                                    )}
                                                    className="w-full cursor-pointer"
                                                >
                                                    <p className="w-full rounded-lg p-2 text-center hover:bg-teal-50">
                                                        + Tambah Badan Usaha
                                                    </p>
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>

                                        <DropdownMenuSeparator className="h-[1px] bg-teal-100" />

                                        <DropdownMenuGroup>
                                            <DropdownMenuItem
                                                className="cursor-pointer rounded-b-lg p-2 font-bold text-slate-700 hover:bg-teal-50"
                                                onClick={() =>
                                                    setOpenLogoutDialog(true)
                                                }
                                            >
                                                <div className="w-full flex items-center justify-between">
                                                    <span className="w-full text-center">
                                                        Logout
                                                    </span>
                                                    <LogOut />
                                                </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex items-center lg:hidden">
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
                                                    href={route("dashboard")}
                                                    className="block lg:hidden w-28 mx-auto"
                                                >
                                                    <img
                                                        src="/images/logo.png"
                                                        alt="Brevet Learning System"
                                                    />
                                                </Link>
                                            </SheetTitle>
                                            <SheetDescription className="text-center text-slate-600">
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

                                            <Separator />

                                            <NavigationMenu className="max-w-full">
                                                <NavigationMenuList className="flex-col gap-2">
                                                    <NavigationMenuItem>
                                                        <Link
                                                            href={route(
                                                                "dashboard",
                                                            )}
                                                        >
                                                            <NavigationMenuLink
                                                                active={
                                                                    route().current(
                                                                        "dashboard",
                                                                    ) ||
                                                                    route().current(
                                                                        "business-entities.index",
                                                                    ) ||
                                                                    route().current(
                                                                        "banks",
                                                                    ) ||
                                                                    route().current(
                                                                        "courses",
                                                                    ) ||
                                                                    route().current(
                                                                        "courses.*",
                                                                    ) ||
                                                                    route().current(
                                                                        "tests",
                                                                    ) ||
                                                                    route().current(
                                                                        "tests.*",
                                                                    ) ||
                                                                    route().current(
                                                                        "profile.*",
                                                                    )
                                                                }
                                                                className={navigationMenuTriggerStyle()}
                                                            >
                                                                Dashboard
                                                            </NavigationMenuLink>
                                                        </Link>
                                                    </NavigationMenuItem>
                                                    {access_rights?.includes(
                                                        "efaktur",
                                                    ) && (
                                                        <NavigationMenuItem>
                                                            <Link
                                                                href={route(
                                                                    "invoice.index",
                                                                )}
                                                            >
                                                                <NavigationMenuLink
                                                                    active={
                                                                        route().current(
                                                                            "invoice.*",
                                                                        ) ||
                                                                        route().current(
                                                                            "retur.*",
                                                                        ) ||
                                                                        route().current(
                                                                            "other.*",
                                                                        )
                                                                    }
                                                                    className={navigationMenuTriggerStyle()}
                                                                >
                                                                    e-Faktur
                                                                </NavigationMenuLink>
                                                            </Link>
                                                        </NavigationMenuItem>
                                                    )}
                                                    {access_rights?.includes(
                                                        "ebupot",
                                                    ) && (
                                                        <NavigationMenuItem>
                                                            <Popover>
                                                                <PopoverTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        className={`${
                                                                            route().current(
                                                                                "bppu.*",
                                                                            ) ||
                                                                            route().current(
                                                                                "bpnr.*",
                                                                            ) ||
                                                                            route().current(
                                                                                "sp.*",
                                                                            ) ||
                                                                            route().current(
                                                                                "cy.*",
                                                                            ) ||
                                                                            route().current(
                                                                                "bp21.*",
                                                                            ) ||
                                                                            route().current(
                                                                                "bp26.*",
                                                                            ) ||
                                                                            route().current(
                                                                                "bpa1.*",
                                                                            ) ||
                                                                            route().current(
                                                                                "bpa2.*",
                                                                            ) ||
                                                                            route().current(
                                                                                "mp.*",
                                                                            )
                                                                                ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                                : "border-none shadow-none"
                                                                        }`}
                                                                    >
                                                                        eBupot{" "}
                                                                        <ChevronDown />
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="min-w-fit">
                                                                    <ul className="space-y-2">
                                                                        <li>
                                                                            <Link
                                                                                href={route(
                                                                                    "bppu.notIssued",
                                                                                )}
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    className={`w-full ${
                                                                                        route().current(
                                                                                            "bppu.*",
                                                                                        )
                                                                                            ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                                            : ""
                                                                                    }`}
                                                                                >
                                                                                    BPPU
                                                                                </Button>
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link
                                                                                href={route(
                                                                                    "bpnr.notIssued",
                                                                                )}
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    className={`w-full ${
                                                                                        route().current(
                                                                                            "bpnr.*",
                                                                                        )
                                                                                            ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                                            : ""
                                                                                    }`}
                                                                                >
                                                                                    BPNR
                                                                                </Button>
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link
                                                                                href={route(
                                                                                    "sp.notIssued",
                                                                                )}
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    className={`w-full ${
                                                                                        route().current(
                                                                                            "sp.*",
                                                                                        )
                                                                                            ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                                            : ""
                                                                                    }`}
                                                                                >
                                                                                    Penyetoran
                                                                                    Sendiri
                                                                                </Button>
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link
                                                                                href={route(
                                                                                    "cy.notIssued",
                                                                                )}
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    className={`w-full ${
                                                                                        route().current(
                                                                                            "cy.*",
                                                                                        )
                                                                                            ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                                            : ""
                                                                                    }`}
                                                                                >
                                                                                    Pemotongan
                                                                                    Secara
                                                                                    Digunggung
                                                                                </Button>
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link
                                                                                href={route(
                                                                                    "bp21.notIssued",
                                                                                )}
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    className={`w-full ${
                                                                                        route().current(
                                                                                            "bp21.*",
                                                                                        )
                                                                                            ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                                            : ""
                                                                                    }`}
                                                                                >
                                                                                    BP
                                                                                    21
                                                                                    -
                                                                                    Bukti
                                                                                    Pemotongan
                                                                                    Selain
                                                                                    Pegawai
                                                                                    Tetap
                                                                                </Button>
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link
                                                                                href={route(
                                                                                    "bp26.notIssued",
                                                                                )}
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    className={`w-full ${
                                                                                        route().current(
                                                                                            "bp26.*",
                                                                                        )
                                                                                            ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                                            : ""
                                                                                    }`}
                                                                                >
                                                                                    BP
                                                                                    26
                                                                                    -
                                                                                    Bukti
                                                                                    Pemotongan
                                                                                    Wajib
                                                                                    Pajak
                                                                                    Luar
                                                                                    Negeri
                                                                                </Button>
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link
                                                                                href={route(
                                                                                    "bpa1.notIssued",
                                                                                )}
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    className={`w-full ${
                                                                                        route().current(
                                                                                            "bpa1.*",
                                                                                        )
                                                                                            ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                                            : ""
                                                                                    }`}
                                                                                >
                                                                                    BP
                                                                                    A1
                                                                                    -
                                                                                    Bukti
                                                                                    Pemotongan
                                                                                    A1
                                                                                    Masa
                                                                                    Pajak
                                                                                    Terakhir
                                                                                </Button>
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link
                                                                                href={route(
                                                                                    "bpa2.notIssued",
                                                                                )}
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    className={`w-full ${
                                                                                        route().current(
                                                                                            "bpa2.*",
                                                                                        )
                                                                                            ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                                            : ""
                                                                                    }`}
                                                                                >
                                                                                    BP
                                                                                    A2
                                                                                    -
                                                                                    Bukti
                                                                                    Pemotongan
                                                                                    A2
                                                                                    Masa
                                                                                    Pajak
                                                                                    Terakhir
                                                                                </Button>
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link
                                                                                href={route(
                                                                                    "mp.notIssued",
                                                                                )}
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    className={`w-full ${
                                                                                        route().current(
                                                                                            "mp.*",
                                                                                        )
                                                                                            ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                                            : ""
                                                                                    }`}
                                                                                >
                                                                                    Bukti
                                                                                    Pemotongan
                                                                                    Bulanan
                                                                                    Pegawai
                                                                                    Tetap
                                                                                </Button>
                                                                            </Link>
                                                                        </li>
                                                                    </ul>
                                                                </PopoverContent>
                                                            </Popover>
                                                        </NavigationMenuItem>
                                                    )}
                                                    {(access_rights?.includes(
                                                        "ebupot",
                                                    ) ||
                                                        access_rights?.includes(
                                                            "efaktur",
                                                        )) && (
                                                        <NavigationMenuItem>
                                                            <Link
                                                                href={route(
                                                                    "spt.konsep",
                                                                )}
                                                            >
                                                                <NavigationMenuLink
                                                                    active={route().current(
                                                                        "spt.*",
                                                                    )}
                                                                    className={navigationMenuTriggerStyle()}
                                                                >
                                                                    Surat
                                                                    Pemberitahuan
                                                                    (SPT)
                                                                </NavigationMenuLink>
                                                            </Link>
                                                        </NavigationMenuItem>
                                                    )}
                                                    <NavigationMenuItem>
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    className={`${
                                                                        route().current(
                                                                            "payment",
                                                                        ) ||
                                                                        route().current(
                                                                            "payment.*",
                                                                        )
                                                                            ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                            : "border-none shadow-none"
                                                                    }`}
                                                                >
                                                                    Pembayaran{" "}
                                                                    <ChevronDown />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent>
                                                                <ul>
                                                                    <li>
                                                                        <Link
                                                                            href={route(
                                                                                "payment.creation",
                                                                            )}
                                                                        >
                                                                            <Button
                                                                                variant="ghost"
                                                                                className={`w-full ${
                                                                                    route().current(
                                                                                        "payment.creation",
                                                                                    )
                                                                                        ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                Layanan
                                                                                Mandiri
                                                                                Kode
                                                                                Billing
                                                                            </Button>
                                                                        </Link>
                                                                    </li>
                                                                    <Separator className="my-1" />
                                                                    <li>
                                                                        <Link
                                                                            href={route(
                                                                                "payment.billing",
                                                                            )}
                                                                        >
                                                                            <Button
                                                                                variant="ghost"
                                                                                className={`w-full ${
                                                                                    route().current(
                                                                                        "payment.billing",
                                                                                    )
                                                                                        ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                Daftar
                                                                                Kode
                                                                                Billing
                                                                                Belum
                                                                                Bayar
                                                                            </Button>
                                                                        </Link>
                                                                    </li>
                                                                </ul>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </NavigationMenuItem>
                                                    <NavigationMenuItem>
                                                        <Link
                                                            href={route(
                                                                "ledger",
                                                            )}
                                                        >
                                                            <NavigationMenuLink
                                                                active={
                                                                    route().current(
                                                                        "ledger",
                                                                    ) ||
                                                                    route().current(
                                                                        "ledger.*",
                                                                    )
                                                                }
                                                                className={navigationMenuTriggerStyle()}
                                                            >
                                                                Buku Besar
                                                            </NavigationMenuLink>
                                                        </Link>
                                                    </NavigationMenuItem>
                                                </NavigationMenuList>
                                            </NavigationMenu>
                                        </SheetHeader>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </header>

                <nav className="hidden border-b border-teal-100 bg-gradient-to-r from-white via-teal-50/40 to-amber-50/50 shadow-sm lg:block">
                    <div className="mx-auto px-4 py-4">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <Link href={route("dashboard")}>
                                        <NavigationMenuLink
                                            active={
                                                route().current("dashboard") ||
                                                route().current(
                                                    "business-entities.index",
                                                ) ||
                                                route().current("banks") ||
                                                route().current("courses") ||
                                                route().current("courses.*") ||
                                                route().current("tests") ||
                                                route().current("tests.*") ||
                                                route().current("profile.edit")
                                            }
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            Dashboard
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                {access_rights?.includes("efaktur") && (
                                    <NavigationMenuItem>
                                        <Link href={route("invoice.index")}>
                                            <NavigationMenuLink
                                                active={
                                                    route().current(
                                                        "invoice.*",
                                                    ) ||
                                                    route().current(
                                                        "retur.*",
                                                    ) ||
                                                    route().current("other.*")
                                                }
                                                className={navigationMenuTriggerStyle()}
                                            >
                                                e-Faktur
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                )}
                                {access_rights?.includes("ebupot") && (
                                    <NavigationMenuItem>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={`${
                                                        route().current(
                                                            "bppu.*",
                                                        ) ||
                                                        route().current(
                                                            "bpnr.*",
                                                        ) ||
                                                        route().current(
                                                            "sp.*",
                                                        ) ||
                                                        route().current(
                                                            "cy.*",
                                                        ) ||
                                                        route().current(
                                                            "bp21.*",
                                                        ) ||
                                                        route().current(
                                                            "bp26.*",
                                                        ) ||
                                                        route().current(
                                                            "bpa1.*",
                                                        ) ||
                                                        route().current(
                                                            "bpa2.*",
                                                        ) ||
                                                        route().current("mp.*")
                                                            ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                            : "border-none shadow-none"
                                                    }`}
                                                >
                                                    eBupot <ChevronDown />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="min-w-fit">
                                                <ul className="space-y-2">
                                                    <li>
                                                        <Link
                                                            href={route(
                                                                "bppu.notIssued",
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className={`w-full ${
                                                                    route().current(
                                                                        "bppu.*",
                                                                    )
                                                                        ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                        : ""
                                                                }`}
                                                            >
                                                                BPPU
                                                            </Button>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            href={route(
                                                                "bpnr.notIssued",
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className={`w-full ${
                                                                    route().current(
                                                                        "bpnr.*",
                                                                    )
                                                                        ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                        : ""
                                                                }`}
                                                            >
                                                                BPNR
                                                            </Button>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            href={route(
                                                                "sp.notIssued",
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className={`w-full ${
                                                                    route().current(
                                                                        "sp.*",
                                                                    )
                                                                        ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                        : ""
                                                                }`}
                                                            >
                                                                Penyetoran
                                                                Sendiri
                                                            </Button>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            href={route(
                                                                "cy.notIssued",
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className={`w-full ${
                                                                    route().current(
                                                                        "cy.*",
                                                                    )
                                                                        ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                        : ""
                                                                }`}
                                                            >
                                                                Pemotongan
                                                                Secara
                                                                Digunggung
                                                            </Button>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            href={route(
                                                                "bp21.notIssued",
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className={`w-full ${
                                                                    route().current(
                                                                        "bp21.*",
                                                                    )
                                                                        ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                        : ""
                                                                }`}
                                                            >
                                                                BP 21 - Bukti
                                                                Pemotongan
                                                                Selain Pegawai
                                                                Tetap
                                                            </Button>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            href={route(
                                                                "bp26.notIssued",
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className={`w-full ${
                                                                    route().current(
                                                                        "bp26.*",
                                                                    )
                                                                        ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                        : ""
                                                                }`}
                                                            >
                                                                BP 26 - Bukti
                                                                Pemotongan Wajib
                                                                Pajak Luar
                                                                Negeri
                                                            </Button>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            href={route(
                                                                "bpa1.notIssued",
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className={`w-full ${
                                                                    route().current(
                                                                        "bpa1.*",
                                                                    )
                                                                        ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                        : ""
                                                                }`}
                                                            >
                                                                BP A1 - Bukti
                                                                Pemotongan A1
                                                                Masa Pajak
                                                                Terakhir
                                                            </Button>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            href={route(
                                                                "bpa2.notIssued",
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className={`w-full ${
                                                                    route().current(
                                                                        "bpa2.*",
                                                                    )
                                                                        ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                        : ""
                                                                }`}
                                                            >
                                                                BP A2 - Bukti
                                                                Pemotongan A2
                                                                Masa Pajak
                                                                Terakhir
                                                            </Button>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            href={route(
                                                                "mp.notIssued",
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className={`w-full ${
                                                                    route().current(
                                                                        "mp.*",
                                                                    )
                                                                        ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                        : ""
                                                                }`}
                                                            >
                                                                Bukti Pemotongan
                                                                Bulanan Pegawai
                                                                Tetap
                                                            </Button>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </PopoverContent>
                                        </Popover>
                                    </NavigationMenuItem>
                                )}
                                {(access_rights?.includes("ebupot") ||
                                    access_rights?.includes("efaktur")) && (
                                    <NavigationMenuItem>
                                        <Link href={route("spt.konsep")}>
                                            <NavigationMenuLink
                                                active={route().current(
                                                    "spt.*",
                                                )}
                                                className={navigationMenuTriggerStyle()}
                                            >
                                                Surat Pemberitahuan (SPT)
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                )}
                                <NavigationMenuItem>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={`${
                                                    route().current(
                                                        "payment",
                                                    ) ||
                                                    route().current("payment.*")
                                                        ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                        : "border-none shadow-none"
                                                }`}
                                            >
                                                Pembayaran <ChevronDown />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <ul>
                                                <li>
                                                    <Link
                                                        href={route(
                                                            "payment.creation",
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            className={`w-full ${
                                                                route().current(
                                                                    "payment.creation",
                                                                )
                                                                    ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                    : ""
                                                            }`}
                                                        >
                                                            Layanan Mandiri Kode
                                                            Billing
                                                        </Button>
                                                    </Link>
                                                </li>
                                                <Separator className="my-1" />
                                                <li>
                                                    <Link
                                                        href={route(
                                                            "payment.billing",
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            className={`w-full ${
                                                                route().current(
                                                                    "payment.billing",
                                                                )
                                                                    ? "bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
                                                                    : ""
                                                            }`}
                                                        >
                                                            Daftar Kode Billing
                                                            Belum Bayar
                                                        </Button>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </PopoverContent>
                                    </Popover>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href={route("ledger")}>
                                        <NavigationMenuLink
                                            active={
                                                route().current("ledger") ||
                                                route().current("ledger.*")
                                            }
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            Buku Besar
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </nav>

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
