import { component$, type QRL } from '@builder.io/qwik';
import { cn } from '~/lib/utils';
import { Button } from './button';

type DialogProps = {
    isOpen: boolean;
    title: string;
    description: string;
    onClose$: QRL<() => void>;
    onConfirm$: QRL<() => void>;
    confirmLabel?: string;
    cancelLabel?: string;
};

export const Dialog = component$(({ 
    isOpen,
    title,
    description,
    onClose$,
    onConfirm$,
    confirmLabel = "Ya, Lanjutkan",
    cancelLabel = "Batal"
}: DialogProps) => {
    return (
        <>
            <div
                class={cn(
                    "fixed inset-0 z-100 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                )}
                onClick$={onClose$}
            />

            <div
                class={cn(
                    "fixed left-1/2 top-1/2 z-110 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 transition-all duration-300 font-roboto",
                    isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                )}
            >
                <div class="overflow-hidden rounded-xl bg-custom-neutral-base border-custom-neutral-100 border-2 py-8 px-6 shadow-2xl text-center grid gap-y-6">
                    <div class="flex flex-col gap-y-4">
                        <h3 class="text-custom-neutral-900 font-medium text-h3-small sm:text-h3-medium lg:text-h3-large">
                            {title}
                        </h3>

                        <p class="text-custom-neutral-700 text-body-small sm:text-body-medium">
                            {description}
                        </p>
                    </div>

                    <div class="w-[60%] bg-custom-neutral-50 h-0.5 block self-center justify-self-center" />

                    <div class="flex flex-wrap items-center justify-center gap-6">
                        <Button
                            size="small"
                            variant="tertiary" 
                            onClick$={onClose$}
                        >
                            {cancelLabel}
                        </Button>
                        
                        <Button
                            size="small"
                            variant="destructive" 
                            onClick$={onConfirm$}
                        >
                            {confirmLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
});