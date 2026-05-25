import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import { LuCalendarDays } from "@qwikest/icons/lucide";
import { cn } from "~/lib/utils";

interface FinanceData {
    label: string;
    nominal: number;
    tanggal: string;
}

interface FinanceInfoProps {
    data: FinanceData[];
    class?: string;
}

export const FinanceInfo = component$(({ data, class: className }: FinanceInfoProps) => {
    const marqueeRef = useSignal<Element>();

    const formatRupiah = (val: number) => {
        return "Rp" + val.toLocaleString("id-ID");
    };

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
        if (!marqueeRef.value) return;

        const el = marqueeRef.value;
        const container = el.querySelector('.inner') as HTMLDivElement | null;
        if (!container) return;

        const originalContent = container.innerHTML;
        const initialSpeed = 1;
        const speed = initialSpeed;
        let progress = 0;
        let animationFrameId: number;

        const setupContent = () => {
            if (window.innerWidth < 1024) {
                if (container.innerHTML === originalContent) {
                    container.innerHTML = originalContent + originalContent;
                }
            } else {
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
                
                for (let i = 0; i < children.length / 2; i++) {
                    const child = children[i] as HTMLElement;
                    originalWidth += child.offsetWidth + 32; // gap-8 = 32px
                }

                progress -= speed;
                if (Math.abs(progress) >= originalWidth) progress = 0;

                container.style.transform = `translateX(${progress}px) skewX(${speed * 0.2}deg)`;
            }
            animationFrameId = window.requestAnimationFrame(loop);
        };

        animationFrameId = window.requestAnimationFrame(loop);

        cleanup(() => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', setupContent);
        });
    });

    return (
        <aside
            ref={marqueeRef}
            class={cn(
                // Menambahkan h-full agar background mengisi seluruh ruang vertikal
                "relative py-6 px-4 bg-custom-neutral-base border-b-2 border-b-custom-neutral-50 lg:border-l-2 lg:border-l-custom-neutral-50 h-full lg:h-full overflow-hidden marquee flex flex-col",
                className
            )}
        >
            <div class="flex gap-8 px-4 w-fit lg:flex-col lg:w-full lg:h-full lg:overflow-y-auto inner transition-transform duration-0">
                {data.map((item, index) => (
                    <div 
                        key={index} 
                        class="flex flex-col gap-4 shrink-0 content-item"
                    >
                        <div class="flex flex-col">
                            <h3 class="font-aladin text-primary-400 text-h3-large lg:text-h2-small leading-tight">
                                {item.label}
                            </h3>
                            <p class="font-roboto font-medium text-custom-neutral-700 text-label-large lg:text-h3-small">
                                {formatRupiah(item.nominal)}
                            </p>
                        </div>

                        <div class="flex items-center gap-2.5 font-roboto text-custom-neutral-500">
                            <LuCalendarDays class="h-6 w-6" />
                            <span class="font-normal text-label-medium lg:text-h3-small">
                                {item.tanggal}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
});