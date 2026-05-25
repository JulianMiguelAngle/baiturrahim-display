import { component$, PropFunction } from '@builder.io/qwik';
import { cn } from '~/lib/utils';
import { 
    LuX, 
    LuImage, 
    LuType, 
    LuBanknote, 
    LuLogOut 
} from '@qwikest/icons/lucide';
import { Link, useLocation } from '@builder.io/qwik-city';

type SidebarProps = {
    isOpen: boolean;
    onClose$: PropFunction<() => void>;
    onLogout$: PropFunction<() => void>;
};

type MenuItem = {
    label: string;
    href: string;
    icon: any;
};

export const Sidebar = component$(({ isOpen, onClose$, onLogout$ }: SidebarProps) => {
    const loc = useLocation();

    const menuItems: MenuItem[] = [
        { label: 'Poster Kegiatan', href: '/display/poster-kegiatan', icon: LuImage },
        { label: 'Teks Berjalan', href: '/display/teks-berjalan', icon: LuType },
        { label: 'Laporan Keuangan', href: '/display/laporan-keuangan', icon: LuBanknote },
    ];

    return (
        <>
        <div
            class={cn(
            "fixed inset-0 z-60 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
                isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            )}
            onClick$={onClose$}
        />

        <aside
            class={cn(
            "fixed top-0 left-0 z-70 h-screen w-72 bg-custom-neutral-base shadow-2xl transition-transform duration-300 ease-in-out transform",
            "pl-4 py-6 pr-6 font-roboto flex flex-col gap-y-6 justify-between",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div class="flex items-center justify-between">
                <div class="flex items-center justify-between gap-3">
                    <div class="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                        B
                    </div>

                    <h2 class="text-label-small sm:text-label-medium font-bold text-custom-neutral-800">Masjid Baiturrahim</h2>
                </div>

                <button 
                    onClick$={onClose$}
                    class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500"
                >
                    <LuX class="w-6 h-6" />
                </button>
            </div>

            <div class="w-full bg-custom-neutral-50 h-0.5 block self-center justify-self-center" />

            <nav class="flex flex-col gap-1.5 h-[calc(100%-160px)] overflow-y-auto">                    
                {menuItems.map((item) => {
                    const currentPath = loc.url.pathname.replace(/\/$/, "") || "/";
                    const targetPath = item.href.replace(/\/$/, "");
                        
                    const isActive = currentPath.startsWith(targetPath) && targetPath !== "";

                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick$={onClose$}
                            class={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 text-label-small sm:text-label-medium",
                                isActive 
                                    ? "bg-primary-base text-primary-500 font-medium" 
                                    : "text-custom-neutral-500 hover:bg-custom-neutral-50 font-normal"
                            )}
                        >
                            <Icon class={cn("w-5 h-5", isActive ? "text-primary-500" : "text-custom-neutral-500")} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div class="w-full bg-custom-neutral-50 h-0.5 block self-center justify-self-center" />

            <button
                class="p-4 flex items-center gap-4 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
                onClick$={onLogout$}    
            >
                <LuLogOut class="w-5 h-5" />
                <span class="text-label-small sm:text-label-medium">Keluar Akun</span>
            </button>
        </aside>
        </>
    );
});