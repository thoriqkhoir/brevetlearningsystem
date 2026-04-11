import { cn } from "@/lib/utils";
import { InertiaLinkProps, Link } from "@inertiajs/react";
import { NavigationMenuLink } from "../ui/navigation-menu";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            className={cn(
                "block select-none w-full space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                className
            )}
            {...props}
        >
            <NavigationMenuLink active={active}>
                <div className="text-sm font-medium leading-none text-start">
                    {children}
                </div>
            </NavigationMenuLink>
        </Link>
    );
}
