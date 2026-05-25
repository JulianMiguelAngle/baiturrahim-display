import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { LuImageOff } from "@qwikest/icons/lucide";
import { cn } from "~/lib/utils";

export interface PosterData {
    id: number;
    url_gambar: string;
    nama_file: string;
    dibuat_pada: Date | null;
}

interface PosterSliderProps {
    posters: PosterData[];
    intervalSeconds?: number;
    class?: string;
}

export const PosterSlider = component$(({ 
    posters, 
    intervalSeconds = 15,
    class: className 
}: PosterSliderProps) => {
    const currentIndex = useSignal(0);
    const hasPosters = posters.length > 0;

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
        if (posters.length <= 1) return;

        const intervalId = setInterval(() => {
            currentIndex.value = (currentIndex.value + 1) % posters.length;
        }, intervalSeconds * 1000);

        cleanup(() => clearInterval(intervalId));
    });

    if (!hasPosters) {
        return (
            <div class={cn(
                "w-full h-full flex flex-col items-center justify-center bg-custom-neutral-50 text-custom-neutral-400 gap-4 p-8 text-center border-x border-custom-neutral-100",
                className
            )}>
                <LuImageOff class="w-16 h-16 opacity-50" />
                <div class="flex flex-col gap-1">
                    <h3 class="text-h3-small font-medium text-custom-neutral-600">Belum Ada Poster Kegiatan</h3>
                    <p class="text-label-medium">Silakan unggah poster melalui halaman admin.</p>
                </div>
            </div>
        );
    }

    // --- TAMPILAN SLIDER ---
    return (
        <div 
            class={cn(
                "relative w-full h-full overflow-hidden bg-custom-neutral-100", 
                className
            )}
        >
            {posters.map((poster, index) => {
                const isActive = index === currentIndex.value;

                return (
                    <div
                        key={poster.id}
                        class={cn(
                            "py-4 absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out",
                            isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                        )}
                    >
                        <img
                            height={1000}
                            width={1000}
                            src={poster.url_gambar}
                            alt={poster.nama_file}
                            class="w-full h-full object-contain"
                        />
                    </div>
                );
            })}

            {posters.length > 1 && (
                <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {posters.map((_, index) => (
                        <div 
                            key={index}
                            class={cn(
                                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                                index === currentIndex.value 
                                    ? "bg-primary-base w-6"
                                    : "bg-white/50"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});