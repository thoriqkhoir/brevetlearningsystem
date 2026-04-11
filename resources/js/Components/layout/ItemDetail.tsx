interface ItemDetailProps {
    title: string;
    detail: string;
    className?: string;
}

export default function ItemDetail({
    title,
    detail,
    className = "",
}: ItemDetailProps) {
    return (
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            <label className="md:w-1/4 text-sm font-medium text-zinc-600">
                {title}
            </label>
            <div className="hidden md:block"> : </div>
            <p
                className={
                    "w-3/4 mb-4 md:mb-0 font-semibold text-primary " + className
                }
            >
                {detail}
            </p>
        </div>
    );
}
