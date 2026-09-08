interface StatusBadgeProps {
    status: string
}

export default function StatusBadge(
    { status }: StatusBadgeProps
) {

    return (
        <span className="badge badge-outline">

            {status}

        </span>
    );
}