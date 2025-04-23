import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function Layout({
    children,
    breadcrumb,
}: {
    children: React.ReactNode;
    breadcrumb: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex-1 overflow-auto">
                <div className="sticky top-0 z-10 border-b">
                    <div className="container mx-auto px-4 py-4">
                        {breadcrumb}
                    </div>
                </div>
                <main className="container mx-auto px-4 py-6">{children}</main>
            </div>
        </SidebarProvider>
    );
}
