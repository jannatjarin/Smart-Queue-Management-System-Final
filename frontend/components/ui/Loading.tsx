export default function Loading() {
    return (
        <div className="flex items-center justify-center rounded-full border border-[#d5c4b0] bg-[#fffaf0] px-5 py-3">
            <span className="loading loading-spinner loading-sm" />

            <span className="ml-3 text-sm font-bold text-[#665d54]">
                Loading...
            </span>
        </div>
    );
}