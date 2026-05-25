import { useSignal, useVisibleTask$, $, Signal } from '@builder.io/qwik';
import type { ActionStore } from '@builder.io/qwik-city';

export type ToastStatus = 'success' | 'error';

export const useFormFeedback = (
    formAction: ActionStore<any, any>, 
    loaderData?: Readonly<Signal<any>>
) => {
    const isVisible = useSignal(false);
    const status = useSignal<ToastStatus>('success');
    const message = useSignal('');

    const hideToast = $(() => {
        isVisible.value = false;
    });

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        if (loaderData?.value?.error) {
            status.value = 'error';
            message.value = loaderData.value.error;
            isVisible.value = true;
        }
    });

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
        const actionResult = track(() => formAction.value);

        if (actionResult) {
            if (actionResult.failed) {
                status.value = 'error';
                message.value = actionResult.response?.message || "Terjadi kesalahan sistem.";
                isVisible.value = true;
            } else if (actionResult.response?.message) {
                status.value = 'success';
                message.value = actionResult.response.message;
                isVisible.value = true;
            }
        }
    });

    return {
        isVisible,
        status,
        message,
        hideToast
    };
};
// export const useFormFeedback = (action: any) => {
//     const isVisible = useSignal(false);
//     const status = useSignal<ToastStatus>('success');
//     const message = useSignal('');

//     useVisibleTask$(({ track }) => {
//         // Pantau action.value secara utuh
//         const result = track(() => action.value);

//         // Cek apakah ada respon masuk (baik message langsung atau di dalam response)
//         const responseData = result?.response || result;

//         if (responseData?.message) {
//             // Reset dulu agar animasi Toast bisa muncul ulang jika upload berkali-kali
//             isVisible.value = false;

//             // Gunakan timeout kecil untuk memberi jeda reset reaktivitas
//             setTimeout(() => {
//                 message.value = responseData.message;
//                 status.value = (result?.status === 'error' || result?.failed) ? 'error' : 'success';
//                 isVisible.value = true;
//                 console.info("🚀 Toast Triggered Otomatis:", responseData.message);
//             }, 50);
//         }
//     });

//     return {
//         isVisible,
//         message,
//         status,
//         hideToast: $(() => isVisible.value = false)
//     };
// };