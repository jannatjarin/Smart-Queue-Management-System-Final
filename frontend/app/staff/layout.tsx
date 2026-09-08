import RoleGuard from "@/components/auth/RoleGuard";

export default function StaffLayout(
    {
        children
    }: {
        children: React.ReactNode
    }
) {

    return (
        <RoleGuard allowedRole="staff">

            {children}

        </RoleGuard>
    );
}