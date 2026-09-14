interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({
    status,
}: StatusBadgeProps) {
    const normalizedStatus = status.toLowerCase();

    const styles: Record<string, string> = {
        waiting:
            "border-[#e1c86c] bg-[#f7e49a] text-[#705b1e]",

        called:
            "border-[#abcadb] bg-[#dcebf3] text-[#3d6275]",

        completed:
            "border-[#b5ceb2] bg-[#dcebd8] text-[#3f6542]",

        cancelled:
            "border-[#deb1b5] bg-[#f4d5d7] text-[#82464b]",

        open:
            "border-[#b5ceb2] bg-[#dcebd8] text-[#3f6542]",

        closed:
            "border-[#cdc4ba] bg-[#e8e1d8] text-[#665e57]",

        on_break:
            "border-[#e1c86c] bg-[#f7e49a] text-[#705b1e]",

        sent:
            "border-[#abcadb] bg-[#dcebf3] text-[#3d6275]",
    };

    const dotStyles: Record<string, string> = {
        waiting: "bg-[#c49d29]",
        called: "bg-[#689ab3]",
        completed: "bg-[#69936b]",
        cancelled: "bg-[#bd6970]",
        open: "bg-[#69936b]",
        closed: "bg-[#847b73]",
        on_break: "bg-[#c49d29]",
        sent: "bg-[#689ab3]",
    };

    const label = status
        .replaceAll("_", " ")
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );

    return (
        <span
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
                styles[normalizedStatus] ||
                "border-[#cdc4ba] bg-[#eee7de] text-[#665e57]"
            }`}
        >
            <span
                className={`h-2 w-2 rounded-full ${
                    dotStyles[normalizedStatus] ||
                    "bg-[#847b73]"
                }`}
                aria-hidden="true"
            />

            {label}
        </span>
    );
}