import { component$, PropFunction } from '@builder.io/qwik';
import { LuMenu, LuUserCircle } from '@qwikest/icons/lucide';

type NavbarProps = {
    onOpen$: PropFunction<() => void>;
};

export const Navbar = component$(({ onOpen$ }: NavbarProps) => {
    return (
        <nav class="w-full h-22.5 bg-custom-neutral-base border-b-2 border-custom-neutral-200 flex items-center justify-between py-4 px-4 sm:px-6 lg:px-9 font-roboto">
            <button 
                onClick$={onOpen$}
                class="p-2.5 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 rounded-xl transition-all active:scale-95"
            >
                <LuMenu class="w-6 h-6" />
            </button>

            <div class="flex items-center gap-3 cursor-pointer group">
                <div class="text-right hidden sm:block">
                    <p class="text-label-small sm:text-label-medium font-semibold text-custom-neutral-800 transition-colors">Admin Masjid</p>
                    <p class="text-label-small sm:text-label-medium font-medium text-custom-neutral-400">Manajer Konten</p>
                </div>

                <div class="w-10 h-10 rounded-full flex items-center justify-center border-2 border-transparent transition-all">
                    <LuUserCircle class="w-8 h-8 stroke-custom-neutral-700" />
                </div>
            </div>
        </nav>
    );
});