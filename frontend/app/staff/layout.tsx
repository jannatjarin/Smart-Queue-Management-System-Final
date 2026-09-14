import RoleGuard from "@/components/auth/RoleGuard";
import StaffNavigation from "@/components/staff/StaffNavigation";

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRole="staff">
            <div className="-mx-5 min-h-full bg-[#f7f1e7]">
                <StaffNavigation />

                <div className="px-5">
                    {children}
                </div>
            </div>
        </RoleGuard>
    );
}