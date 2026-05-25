import { component$, QwikIntrinsicElements, useSignal, useTask$ } from '@builder.io/qwik';
import { cn } from '~/lib/utils';

type TextAreaProps = QwikIntrinsicElements['textarea'] & {
    label?: string;
    error?: string;
    errorPulse?: number;
};

export const TextArea = component$(({ label, error, errorPulse, id, class: className, ...props }: TextAreaProps) => {
    const displayError = useSignal<string | undefined>(undefined);
    
    useTask$(({ track }) => {
        const currentError = track(() => error);
        track(() => errorPulse);
    
        if (currentError) {
            displayError.value = currentError;
    
            const timer = setTimeout(() => {
                displayError.value = undefined;
            }, 5000);
    
            return () => clearTimeout(timer);
        } else {
            displayError.value = undefined;
        }
    });
    
    return (
        <div class={cn("w-full flex flex-col gap-1.5 font-roboto", className)}>
            {label && (
                <label 
                    for={id} 
                    class={cn(
                        "text-label-small sm:text-label-medium font-medium transition-colors",
                        props.disabled ? "text-custom-neutral-400" : "text-custom-neutral-900"
                    )}
                >
                    {label}
                </label>
            )}

            <div class="relative group">
                <textarea
                {...props}
                id={id}
                class={cn(
                    "w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none",
                    
                    "min-h-50 resize-y", 

                    "border-custom-neutral-200 text-custom-neutral-600 placeholder:text-custom-neutral-400",
                    "text-body-small sm:text-body-medium",
                    "focus:border-primary-300 focus:ring-4 focus:ring-primary-900/10",

                    "not-placeholder-shown:border-gray-300 not-placeholder-shown:bg-white",

                    "disabled:bg-custom-neutral-base disabled:border-custom-neutral-200 disabled:text-custom-neutral-400 disabled:cursor-not-allowed",

                    displayError.value ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""
                )}
                placeholder={props.placeholder || " "}
                />
            </div>

            {displayError.value && (
                <span class="text-label-small sm:text-label-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                    {displayError.value}
                </span>
            )}
        </div>
    );
});