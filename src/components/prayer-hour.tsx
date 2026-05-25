import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import { cn } from "~/lib/utils";
import { PrayerSchedule } from "~/types/prayer";

import Subuh from "~/assets/Subuh.avif";
import Dzuhur from "~/assets/Dzuhur.avif";
import Ashar from "~/assets/Ashar.avif";
import Maghrib from "~/assets/Maghrib.avif";
import Isya from "~/assets/Isya.avif";

interface PrayerHourProps {
    jadwal: PrayerSchedule;
    class?: string;
}

export const PrayerHour = component$(({ jadwal, class: className }: PrayerHourProps) => {
    const marqueeRef = useSignal<Element>();

    const listSholat = [
        { name: "Subuh", key: "subuh" as keyof PrayerSchedule, img: Subuh },
        { name: "Dzuhur", key: "dzuhur" as keyof PrayerSchedule, img: Dzuhur },
        { name: "Ashar", key: "ashar" as keyof PrayerSchedule, img: Ashar },
        { name: "Maghrib", key: "maghrib" as keyof PrayerSchedule, img: Maghrib },
        { name: "Isya", key: "isya" as keyof PrayerSchedule, img: Isya },
    ];

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
        if (!marqueeRef.value) return;

        const el = marqueeRef.value;
        const container = el.querySelector('.inner') as HTMLDivElement | null;
        if (!container) return;

        const originalContent = container.innerHTML;
        const initialSpeed = 1;
        let speed = initialSpeed;
        let progress = 0;
        let animationFrameId: number;

        // --- PERBAIKAN: Fungsi Handle Content ---
        const setupContent = () => {
            if (window.innerWidth < 1024) {
                // Hanya duplikasi jika belum diduplikasi
                if (container.innerHTML === originalContent) {
                    container.innerHTML = originalContent + originalContent;
                }
            } else {
                // Kembalikan ke konten asli jika di desktop
                container.innerHTML = originalContent;
                container.style.transform = '';
                progress = 0;
            }
        };

        setupContent();
        window.addEventListener('resize', setupContent);

        const loop = () => {
            if (window.innerWidth < 1024) { 
                const children = container.querySelectorAll('.content-item');
                let originalWidth = 0;
                
                // Hitung lebar berdasarkan elemen asli (setengah dari total children)
                for (let i = 0; i < children.length / 2; i++) {
                    const child = children[i] as HTMLElement;
                    originalWidth += child.offsetWidth + 32; // gap-8 = 32px
                }

                progress -= speed;

                if (Math.abs(progress) >= originalWidth) {
                    progress = 0;
                }

                container.style.transform = `translateX(${progress}px) skewX(${speed * 0.2}deg)`;
            }

            animationFrameId = window.requestAnimationFrame(loop);
        };

        animationFrameId = window.requestAnimationFrame(loop);

        const handleMouseOver = () => { speed = 0; };
        const handleMouseOut = () => { speed = initialSpeed; };

        el.addEventListener('mouseover', handleMouseOver);
        el.addEventListener('mouseout', handleMouseOut);

        cleanup(() => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', setupContent);
            el.removeEventListener('mouseover', handleMouseOver);
            el.removeEventListener('mouseout', handleMouseOut);
        });
    });

    return (
        <aside
            ref={marqueeRef}
            class={cn(
                "relative py-6 bg-custom-neutral-base border-b-2 border-b-custom-neutral-50 lg:border-r-2 lg:border-r-custom-neutral-50 lg:h-full overflow-hidden marquee",
                className
            )}
        >
            <div class="flex gap-8 px-4 w-fit lg:flex-col lg:w-full lg:h-full lg:overflow-y-auto inner transition-transform duration-0">
                {listSholat.map((item) => (
                    <div 
                        key={item.key} 
                        class="flex items-center gap-3 sm:gap-4 lg:gap-5 shrink-0 content-item"
                    >
                        <div class="h-13.5 w-13.5 lg:h-16 lg:w-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                            <img 
                                height={100}
                                width={100}
                                src={item.img} 
                                alt={item.name} 
                                class="w-full h-full object-cover"
                            />
                        </div>

                        <div class="flex flex-col gap-0.5 sm:gap-1">
                            <span class="font-aladin text-primary-400 text-h3-small sm:text-h3-large lg:text-h2-small leading-none">
                                {item.name}
                            </span>
                            <span class="font-roboto text-custom-neutral-500 text-label-small sm:text-label-medium lg:text-h3-small leading-none">
                                {jadwal[item.key] || "--:--"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
});