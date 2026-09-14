import RoleGuard from "@/components/auth/RoleGuard";
import CustomerNavigation from "@/components/customer/CustomerNavigation";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRole="customer">
            <div className="-mx-5 min-h-full bg-[#f7f1e7]">
                <CustomerNavigation />

                <div className="px-5">
                    {children}
                </div>
            </div>
        </RoleGuard>
    );
}