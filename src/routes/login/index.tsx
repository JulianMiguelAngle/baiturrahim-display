import { component$ } from '@builder.io/qwik';
import { routeAction$, routeLoader$ } from '@builder.io/qwik-city';
import * as v from 'valibot';

import bgLogin from '~/assets/Background Login.avif';
import logoMasjid from '~/assets/Logo.avif'; 

import { Button } from '~/components/button';
import { Input } from '~/components/input';
import { LuAlertTriangle } from '@qwikest/icons/lucide';

import { useForm, type InitialValues } from '@modular-forms/qwik';

import { db } from '~/lib/db';
import { usersTable } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { SignJWT } from 'jose';
import { compare } from 'bcryptjs';

const loginSchema = v.object({
    username: v.pipe(
        v.string(),
        v.minLength(1, 'Username tidak boleh kosong')
    ),
    password: v.pipe(
        v.string(),
        v.minLength(1, 'Password tidak boleh kosong')
    ),
});

export const useFormLoader = routeLoader$<InitialValues<v.InferInput<typeof loginSchema>>>(() => {
    return {
        username: '',
        password: '',
    };
});

export const useFormAction = routeAction$(
    async (values, { cookie, fail, env, redirect, platform }) => {
        const result = v.safeParse(loginSchema, values);

        if (!result.success) {
            return fail(400, {
                values,
                errors: v.flatten(result.issues).nested as any,
                response: {}
            });
        }

        const database = db((platform.env as Env).DB)

        const [user] = await database
            .select()
            .from(usersTable)
            .where(eq(usersTable.username, values.username as string))
            .limit(1);

        if (!user) {
            return fail(401, {
                values,
                errors: {
                    username: 'Username atau kata sandi Anda salah.',
                },
                response: {}
            });
        }

        const isPasswordMatch = await compare(values.password as string, user.password);

        if (!isPasswordMatch) {
            return fail(401, {
                values,
                errors: {
                    username: 'Username atau kata sandi Anda salah.',
                },
                response: {}
            });
        }

        const secret = new TextEncoder().encode(env.get('JWT_SECRET'));
        const token = await new SignJWT({ 
            id: user.id, 
            username: user.username,
            fullname: user.fullname 
        })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h') 
        .sign(secret);

        cookie.set('auth_token', token, {
            httpOnly: true,
            path: '/',
            secure: true,
            sameSite: 'lax',
        });

        throw redirect(302, '/display/poster-kegiatan');
    }
);


export default component$(() => {
    const [loginForm, { Form, Field }] = useForm<v.InferInput<typeof loginSchema>>({
        loader: useFormLoader(),
        action: useFormAction()
    });

    return (
        <div 
            class="relative min-h-screen w-full flex items-center justify-center p-6 bg-cover bg-center bg-no-repeat font-roboto"
            style={{ backgroundImage: `url(${bgLogin})` }}
        >
            <div class="absolute inset-0" />

            <main class="py-12 px-6 grid gap-9 relative z-10 w-full max-w-125 bg-custom-neutral-base rounded-3xl shadow-2xl border-2 border-custom-neutral-100">

                <div class="flex flex-col gap-y-4 items-center text-center">
                    <img 
                        src={logoMasjid}
                        alt="Logo Masjid Baiturrahim" 
                        class="w-62.5 object-contain"
                        width={96}
                        height={96}
                    />

                    <h1 class="text-h3-small sm:text-h3-medium lg:text-h3-large font-medium text-custom-neutral-900">
                        Manajemen Konten Masjid
                    </h1>

                    <p class="text-body-small sm:text-body-medium text-custom-neutral-700">
                        Silakan login terlebih dahulu untuk mengelola pesan berjalan, poster kegiatan, dan saldo kas masjid.
                    </p>
                </div>

                <div class="w-full max-w-75 bg-custom-neutral-50 h-px block self-center justify-self-center" />

                <Form class="flex flex-col gap-6">
                    <Field 
                        name="username"
                    >
                        {(field, props) => (
                            <Input 
                                label="Nama Pengguna"
                                placeholder="Masukkan nama pengguna Anda..."
                                error={field.error}
                                errorPulse={loginForm.submitCount}
                                {...props}
                            />
                        )}
                    </Field>

                    <Field
                        name="password"
                    >
                        {(field, props) => (
                            <Input 
                                label="Kata Sandi"
                                type="password"
                                placeholder="Masukkan kata sandi Anda..."
                                error={field.error}
                                errorPulse={loginForm.submitCount}
                                {...props}
                            />
                        )}
                    </Field>

                    <Button 
                        fillContainer 
                        variant="primary"
                        size="large"
                        type="submit"
                        disabled={loginForm.submitting}
                    >
                        Masuk Sekarang
                    </Button>
                </Form>

                <div class="w-full max-w-75 bg-custom-neutral-50 h-px block self-center justify-self-center" />

                <div class="flex gap-4 items-center text-label-small sm:text-label-medium text-custom-neutral-500">
                    <LuAlertTriangle class="w-8 h-8" />
                    <p>Halaman ini merupakan akses khusus bagi pengurus yang diberikan amanah mengelola sistem.</p>            
                </div>
            </main>
        </div>
    );
});