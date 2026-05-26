import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

interface RunningTextProps {
    teks: string;
    class?: string;
}

export const RunningText = component$(({ teks, class: className }: RunningTextProps) => {
    const marqueeRef = useSignal<Element>();

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup, track }) => {
        track(() => teks); 

        if (!marqueeRef.value) return;
        const el = marqueeRef.value;
        const container = el.querySelector('.inner') as HTMLDivElement | null;
        if (!container) return;

        const originalContent = `<span class="content-item px-12 flex items-center gap-4">
            ${teks}
        </span>`;
        
        container.innerHTML = originalContent + originalContent;

        const initialSpeed = 1.2;
        const speed = initialSpeed;
        let progress = 0;
        let animationFrameId: number;

        const loop = () => {
            const children = container.querySelectorAll('.content-item');
            let originalWidth = 0;
            for (let i = 0; i < children.length / 2; i++) {
                const child = children[i] as HTMLElement;
                originalWidth += child.offsetWidth;
            }

            progress -= speed;
            if (Math.abs(progress) >= originalWidth) progress = 0;

            container.style.transform = `translateX(${progress}px)`;
            animationFrameId = window.requestAnimationFrame(loop);
        };

        animationFrameId = window.requestAnimationFrame(loop);
        cleanup(() => window.cancelAnimationFrame(animationFrameId));
    });

    return (
        <div ref={marqueeRef} class={cn("py-6 relative bg-primary-700 text-primary-base w-full overflow-hidden marquee", className)}>
            <div class="w-fit flex items-center text-nowrap inner text-h3-small font-medium font-literata">
                <span class="content-item px-12 flex items-center gap-4">
                    {teks}
                </span>
            </div>
        </div>
    );
});