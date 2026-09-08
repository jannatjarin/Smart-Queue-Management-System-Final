import RoleGuard from "@/components/auth/RoleGuard";

export default function AdminLayout(
    {
        children
    }: {
        children: React.ReactNode
    }
) {

    return (
        <RoleGuard allowedRole="admin">

            {children}

        </RoleGuard>
    );
}