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
            <Sidebar>
                <SidebarHeader>
                    <Link
                        href={route("dashboard")}
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
                                    <h3 className="text-sm text-primary/80 font-medium">
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
                                <div className="flex items-center ml-8 text-sm bg-emerald-100 border border-emerald-300 rounded-xl my-2 px-4 text-center font-semibold text-emerald-800">
                                    Kelas Aktif: {active_course.name}
                                    <Button
                                        size="sm"
                                        className="ml-4 text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100 hover:text-orange-700"
                                        variant="outline"
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
                                        <div className="flex items-center hover:cursor-pointer mr-6 gap-2">
                                            <div>
                                                {activeBusinessEntity &&
                                                activeBusinessEntity.id !==
                                                    user.id ? (
                                                    <p className="text-center font-medium text-gray-600 text-xs">
                                                        You are currently
                                                        impersonating user
                                                    </p>
                                                ) : null}
                                                <p className="font-medium text-center">
                                                    {activeBusinessEntity
                                                        ? ` ${activeBusinessEntity.npwp} ${activeBusinessEntity.name}`
                                                        : `${user.npwp} ${user.name}`}
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center text-white text-lg font-semibold">
                                                {getInitials(
                                                    activeBusinessEntity
                                                        ? activeBusinessEntity.name
                                                        : user.name,
                                                )}
                                            </div>
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="z-50 w-96 bg-white shadow-lg rounded-lg mt-2 border border-gray-400">
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
                                                <p className="w-full cursor-pointer p-2 text-center hover:bg-gray-100 hover:rounded-lg">
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
                                                    <p className="w-full cursor-pointer p-2 text-center hover:bg-gray-100 hover:rounded-lg">
                                                        {e.npwp} {e.name}
                                                    </p>
                                                </DropdownMenuItem>
                                            ))}

                                            <DropdownMenuSeparator className="bg-gray-400 h-[1px] my-2" />

                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={route(
                                                        "business-entities.create",
                                                    )}
                                                    className="w-full cursor-pointer"
                                                >
                                                    <p className="w-full p-2 text-center hover:bg-gray-100 hover:rounded-lg">
                                                        + Tambah Badan Usaha
                                                    </p>
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>

                                        <DropdownMenuSeparator className="bg-gray-400 h-[1px]" />

                                        <DropdownMenuGroup>
                                            <DropdownMenuItem
                                                className="cursor-pointer p-2 font-bold hover:bg-gray-100 hover:rounded-b-lg"
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
                                    <SheetContent side={"top"}>
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
                                            <SheetDescription className="text-center">
                                                <h2 className="text-base text-primary/80 font-medium">
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
                                                                                ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                                            ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                                            ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                                            ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                                            ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                                            ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                                            ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                                            ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                                            ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                                            ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                            ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                                        ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                                        ? "bg-primary text-background hover:bg-primary hover:text-background"
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

                <nav className="bg-sidebar shadow hidden lg:block">
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
                                                            ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                        ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                        ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                        ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                        ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                        ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                        ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                        ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                        ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                        ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                        ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                    ? "bg-primary text-background hover:bg-primary hover:text-background"
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
                                                                    ? "bg-primary text-background hover:bg-primary hover:text-background"
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
