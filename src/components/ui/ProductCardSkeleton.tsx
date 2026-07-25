export default function ProductCardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-[3/4] rounded-xl bg-fay-surface" />
            <div className="mt-3 h-3.5 w-3/4 rounded bg-fay-surface" />
            <div className="mt-2 h-3.5 w-1/3 rounded bg-fay-surface" />
        </div>
    );
}