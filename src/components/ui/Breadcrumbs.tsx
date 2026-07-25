import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface Crumb {
    label: string;
    to?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-fay-gray">
            {items.map((item, i) => {
                const esUltimo = i === items.length - 1;
                return (
                    <span key={i} className="flex items-center gap-1.5">
                        {item.to && !esUltimo ? (
                            <Link to={item.to} className="transition-colors hover:text-white">
                                {item.label}
                            </Link>
                        ) : (
                            <span className={esUltimo ? "text-white" : undefined}>{item.label}</span>
                        )}
                        {!esUltimo && <ChevronRight size={12} />}
                    </span>
                );
            })}
        </nav>
    );
}
