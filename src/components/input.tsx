import { component$, QwikIntrinsicElements, useSignal, useTask$ } from '@builder.io/qwik';
import { cn } from '~/lib/utils';
import { LuEye, LuEyeOff } from '@qwikest/icons/lucide';

type InputProps = QwikIntrinsicElements['input'] & {
    label?: string;
    error?: string;
    errorPulse?: number;
};

export const Input = component$(({ label, error, errorPulse, id, type = 'text', ...props }: InputProps) => {
    const isPasswordVisible = useSignal(false);
    const isPasswordType = type === 'password';

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

    const inputType = isPasswordType 
        ? (isPasswordVisible.value ? 'text' : 'password') 
        : type;

    return (
        <div class="w-full flex flex-col gap-1.5 font-roboto text-label-small sm:text-label-medium">
            {label && (
                <label 
                    for={id} 
                    class={cn(
                        "font-medium transition-colors",
                        props.disabled ? "text-custom-neutral-400" : "text-custom-neutral-900"
                    )}
                >
                    {label}
                </label>
            )}

            <div class="relative group">
                <input
                    {...props}
                    id={id}
                    type={inputType}
                    class={cn(
                        "w-full pr-5 pl-4 py-3 rounded-[10px] border-2 transition-all duration-200 outline-none",
                        
                        "border-custom-neutral-200 text-custom-neutral-600 placeholder:text-custom-neutral-400",
                        "focus:border-primary-300 focus:ring-4 focus:ring-primary-900/10",

                        "not-placeholder-shown:border-custom-neutral-400 not-placeholder-shown:bg-white",

                        "disabled:bg-custom-neutral-base disabled:border-custom-neutral-200 disabled:text-custom-neutral-400 disabled:cursor-not-allowed",

                        displayError.value ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "",
                        
                        isPasswordType ? "pr-12" : ""
                    )}
                    placeholder={props.placeholder || " "}
                />

                {isPasswordType && !props.disabled && (
                    <button
                        type="button"
                        onClick$={() => (isPasswordVisible.value = !isPasswordVisible.value)}
                        class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-custom-neutral-400 hover:text-primary-400 transition-colors"
                    >
                        {isPasswordVisible.value ? (
                            <LuEyeOff class="w-5 h-5" />
                        ) : (
                            <LuEye class="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>

            {displayError.value && (
                <span class="text-red-500 animate-in fade-in slide-in-from-top-1">
                    {displayError.value}
                </span>
            )}
        </div>
    );
});