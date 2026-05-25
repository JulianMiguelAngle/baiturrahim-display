import { component$, Slot, useSignal } from '@builder.io/qwik';
import { Sidebar } from '~/components/sidebar';
import { Navbar } from '~/components/navbar';
import { routeAction$, routeLoader$ } from '@builder.io/qwik-city';
import { Dialog } from '~/components/dialog';
import { jwtVerify } from 'jose';

export const useLogout = routeAction$(
    async (_, { cookie, redirect }) => {
        cookie.delete('auth_token', { path: '/' });

        throw redirect(302, '/login');
    }
);


export const useAuthLoader = routeLoader$(async ({ cookie, env, url, redirect }) => {
    const token = cookie.get('auth_token')?.value;
    const isLoginPage = url.pathname === '/login/';

    if (!token) {
        if (!isLoginPage) throw redirect(302, '/login');
        return null;
    }

    try {
        const secret = new TextEncoder().encode(env.get('JWT_SECRET'));
        const { payload } = await jwtVerify(token, secret);

        if (isLoginPage) throw redirect(302, '/display/poster-kegiatan');

        return payload;
    } catch {
        cookie.delete('auth_token', { path: '/' });
        if (!isLoginPage) throw redirect(302, '/login');
        return null;
    }
});
 
export default component$(() => {
    const logout = useLogout();
    const isSidebarOpened = useSignal(false);
    const showLogoutModal = useSignal(false);

    return (
        <>
            <Sidebar 
                isOpen={isSidebarOpened.value}
                onClose$={() => isSidebarOpened.value = false} 
                onLogout$={() => showLogoutModal.value = true}
            />

            <Dialog
                isOpen={showLogoutModal.value}
                title="Keluar dari Manajemen Konten Masjid"
                description="Terima kasih atas dedikasi Anda dalam mengelola informasi Masjid Baiturrahim hari ini. Apakah Anda yakin ingin mengakhiri sesi ini dan keluar?"
                confirmLabel="Keluar Sekarang"
                cancelLabel="Tetap di Sini"
                onClose$={() => showLogoutModal.value = false}
                onConfirm$={() => {
                    showLogoutModal.value = false;
                    logout.submit();
                }}
            />

            <div class="grid gap-6">
                <Navbar onOpen$={() => isSidebarOpened.value = true} />
                <div class="py-9 px-4 sm:px-6 lg:px-9 grid gap-8">
                    <Slot />
                </div>
            </div>
        </>
    );
});