interface StatusBadgeProps {
    status: string;
}


export default function StatusBadge(
    {
        status,
    }: StatusBadgeProps
) {

    const normalizedStatus =
        status.toLowerCase();


    const styles:
        Record<
            string,
            string
        > =
    {
        waiting:
            "border-[#ead79b] bg-[#fff3cd] text-[#775b17]",

        called:
            "border-[#cddcf1] bg-[#e6f1ff] text-[#3e6189]",

        completed:
            "border-[#c8e7d8] bg-[#e2f5ec] text-[#35664f]",

        cancelled:
            "border-[#edcbd5] bg-[#fce4ec] text-[#8a4c5f]",

        open:
            "border-[#c8e7d8] bg-[#e2f5ec] text-[#35664f]",

        closed:
            "border-[#ddd7e5] bg-[#f0edf4] text-[#686274]",

        on_break:
            "border-[#ead79b] bg-[#fff3cd] text-[#775b17]",

        sent:
            "border-[#d7ceef] bg-[#ece7ff] text-[#5d5488]",
    };


    const dotStyles:
        Record<
            string,
            string
        > =
    {
        waiting:
            "bg-[#d3a93e]",

        called:
            "bg-[#6e9dd0]",

        completed:
            "bg-[#67a982]",

        cancelled:
            "bg-[#c9788f]",

        open:
            "bg-[#67a982]",

        closed:
            "bg-[#918a99]",

        on_break:
            "bg-[#d3a93e]",

        sent:
            "bg-[#8b7ebd]",
    };


    const label =
        status
            .replaceAll(
                "_",
                " "
            )
            .replace(
                /\b\w/g,
                (
                    letter
                ) =>
                    letter
                        .toUpperCase()
            );


    return (
        <span
            className={`
                inline-flex
                w-fit
                items-center
                gap-1.5
                rounded-full
                border
                px-3
                py-1.5
                text-xs
                font-bold
                ${
                    styles[
                        normalizedStatus
                    ] ||
                    "border-[#ddd7e5] bg-[#f5f2f7] text-[#686274]"
                }
            `}
        >

            <span
                className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    ${
                        dotStyles[
                            normalizedStatus
                        ] ||
                        "bg-[#918a99]"
                    }
                `}
                aria-hidden="true"
            />


            {label}

        </span>
    );

}