import { component$ } from "@builder.io/qwik";
import { LuClock } from "@qwikest/icons/lucide";
import { cn } from "~/lib/utils";

type DisplayHeaderProps = {
    time: string;
    dateGregorian: string;
    dateHijri: string;
    logoSrc?: string;
    class?: string;
}

export const DisplayHeader = component$(({ 
    time, 
    dateGregorian, 
    dateHijri, 
    logoSrc = "/images/logo-baiturrahim.png",
    class: className 
}: DisplayHeaderProps) => {
    return (
        <header class={cn(
        "w-full flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-white border-b border-custom-neutral-100 font-roboto",
        className
        )}>
        
        {/* 1. Bagian Jam */}
        <div class="flex items-center gap-4">
            <div class="p-1 bg-primary-base text-primary-400 rounded-full flex items-center justify-center">
            <LuClock class="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
            <div class="text-custom-neutral-700 font-medium text-label-medium lg:text-h3-medium">
            {time} WIB
            </div>
        </div>

        {/* 2. Bagian Logo */}
        <div class="flex items-center justify-center">
            <img 
                height={100}
                width={100}
                src={logoSrc} 
                alt="Logo Masjid Baiturrahim" 
                class="h-17.5 w-50 lg:h-22.5 lg:w-62.5 object-contain"
            />
        </div>

        {/* 3. Bagian Date (Tanggal) */}
        <div class="flex flex-col items-end gap-2 lg:gap-4">
            {/* Gregorian / Romawi */}
            <span class="font-medium text-custom-neutral-700 text-label-medium lg:text-h3-medium">
            {dateGregorian}
            </span>
            {/* Hijri */}
            <span class="py-1.5 px-3 bg-primary-400 rounded-lg text-primary-base text-label-medium lg:text-h3-medium font-medium">
            {dateHijri}
            </span>
        </div>

        </header>
    );
});