import { component$, Slot } from '@builder.io/qwik';

import type { QwikIntrinsicElements } from '@builder.io/qwik';

import { tv } from 'tailwind-variants';
import { cn } from '~/lib/utils';

type ButtonProps = QwikIntrinsicElements['button'] & {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
	size?: 'small' | 'medium' | 'large';
    fillContainer?: boolean;
}
const button = tv({
    base: "py-2 transition-all duration-200 *:font-medium *:font-roboto *:text-label-small *:sm:text-label-medium rounded-lg border-2 border-solid flex items-center justify-center text-center disabled:cursor-not-allowed",
    variants: {
        color: {
            primary: "bg-primary-400 border-primary-300 hover:enabled:bg-primary-500 active:enabled:bg-primary-400 text-custom-neutral-base",
            
            secondary: "bg-transparent border-primary-400 text-primary-400 hover:enabled:border-primary-500 hover:enabled:text-primary-500 active:enabled:border-primary-400 active:enabled:text-primary-400",
            
            tertiary: "bg-transparent border-transparent text-primary-400 hover:enabled:text-primary-500 active:enabled:text-primary-400",
            
            destructive: "bg-red-600 border-red-400 text-custom-neutral-base hover:enabled:bg-red-500 hover:enabled:border-red-300 active:enabled:bg-red-600 active:enabled:border-red-400",
        },
        size: {
            small: "px-4.5 h-11",
            medium: "px-5 h-12",
            large: "px-6 h-12.5",
        },
        disabled: {
            true: ""
        }
    },
    compoundVariants: [
        {
            color: ["primary", "secondary", "tertiary", "destructive"],
            disabled: true,
            class: "text-custom-neutral-400"
        },
        {
            color: ["primary", "destructive"],
            disabled: true,
            class: "bg-custom-neutral-50 border-custom-neutral-100"
        },
        {
            color: ["secondary"],
            disabled: true,
            class: "border-custom-neutral-100 bg-transparent"
        }
    ],
    defaultVariants: {
        size: "small",
        color: "primary",
    },
});

export const Button = component$<ButtonProps>(({
    variant = "primary",
    size = "small",
    class: className,
    fillContainer = false,
	...props
}) => {
    return (
        <button
            {...props}
            onClick$={props.onClick$}
            class={cn(
                button({ color: variant, size: size, disabled: props.disabled }),
                fillContainer ? "w-full" : "w-fit",
                className
            )}
        >
            <div>
                <Slot />
            </div>
        </button>
    );
});