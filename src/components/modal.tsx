import { component$, type QRL, Slot } from '@builder.io/qwik';
import { LuX } from '@qwikest/icons/lucide';
import { cn } from '~/lib/utils';
import { Button } from './button';

type ModalProps = {
    isOpen: boolean;
    title: string;
    onClose$: QRL<() => void>;
    maxWidth?: 'md' | 'lg' | 'xl' | '2xl';
};

export const Modal = component$(({ 
    isOpen,
    title,
    onClose$,
    maxWidth = 'md'
}: ModalProps) => {
    const maxWidthClasses = {
        'md': 'max-w-md',
        'lg': 'max-w-lg',
        'xl': 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

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
                    "fixed left-1/2 top-1/2 z-110 w-[95%] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 font-roboto",
                    maxWidthClasses[maxWidth],
                    isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                )}
            >
                <div class="overflow-hidden rounded-2xl bg-white border-custom-neutral-100 border-2 shadow-2xl">
                    <div class="flex items-center justify-between border-b border-custom-neutral-50 px-6 py-4 bg-custom-neutral-base">
                        <h3 class="text-custom-neutral-900 font-bold text-h3-small">
                            {title}
                        </h3>
                        <Button 
                            variant="tertiary" 
                            size="small" 
                            onClick$={onClose$}
                            class="p-1! hover:bg-custom-neutral-100 rounded-full"
                        >
                            <LuX class="w-6 h-6 text-custom-neutral-500" />
                        </Button>
                    </div>

                    <div class="p-6">
                        <Slot />
                    </div>
                </div>
            </div>
        </>
    );
});