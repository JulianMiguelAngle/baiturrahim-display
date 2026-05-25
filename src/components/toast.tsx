import { component$, useVisibleTask$, type QRL } from '@builder.io/qwik';
import { LuCheck, LuAlertCircle } from '@qwikest/icons/lucide';
import { tv } from 'tailwind-variants';
import { cn } from '~/lib/utils';

const toastVariants = tv({
    base: "w-full max-w-100 flex items-center gap-4 pl-4 pr-5 py-4 bg-custom-neutral-base border-2 border-custom-neutral-50 shadow-xl rounded-2xl pointer-events-auto transition-all duration-300 text-body-small sm:text-body-medium font-roboto",
    variants: {
        status: {
            success: "text-custom-neutral-600",
            error: "text-custom-neutral-600",
        }
    }
});

const iconVariants = tv({
    base: "flex items-center justify-center min-w-10 min-h-10 rounded-full *:min-w-6 *:min-h-6 *:stroke-[3px]",
    variants: {
        status: {
            success: "bg-emerald-100 text-emerald-600",
            error: "bg-red-100 text-red-600",
        }
    }
});

type ToastProps = {
    message: string | null;
    status: 'success' | 'error';
    isVisible: boolean;
    onClose$: QRL<() => void>;
};

export const Toast = component$(({ message, status, isVisible, onClose$ }: ToastProps) => {
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
        track(() => isVisible);
        
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose$();
            }, 3000);
            return () => clearTimeout(timer);
        }
    });

    return (
        <div 
            class={cn(
                "fixed bottom-10 sm:right-9 z-200 transition-all duration-500",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
            )}
        >
            <div class={toastVariants({ status })}>
                <div class={iconVariants({ status })}>
                    {status === 'success' ? (
                        <LuCheck />
                    ) : (
                        <LuAlertCircle />
                    )}
                </div>

                <p>
                    {message}
                </p>
            </div>
        </div>
    );
});