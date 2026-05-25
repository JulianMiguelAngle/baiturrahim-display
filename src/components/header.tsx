// import { component$, useSignal, $ } from '@builder.io/qwik';
// import { Link } from '@builder.io/qwik-city';
// import { LuSearch, LuMessageCircle, LuMenu, LuX } from '@qwikest/icons/lucide';
// import { MenuItem } from './m';
// import { DropdownMenu } from './dropdown-menu';

// import Logo from "./../../public/Logo Primary.avif?format=avif&height=200&width=200&jsx";

// import Tshirt from "~/assets/Tshirt.avif?format=avif&jsx";
// import Pants from "~/assets/Pants.avif?format=avif&jsx";
// import Shoes from "~/assets/Shoes.avif?format=avif&jsx";
// import Sunglasses from "~/assets/Sunglasses.avif?format=avif&jsx";
// import { SearchModal } from './search-modal';
// import { Product } from '~/types/product';

// export const Header = component$<{ products: Product[]; }>((props) => {
//     const isMenuOpen = useSignal(false);
//     const isSearchModalOpen = useSignal(false);

//     const toggleMenu = $(() => {
//         isMenuOpen.value = !isMenuOpen.value;
//     });

//     const toggleModal = $(() => {
//         isSearchModalOpen.value = true;
//     });
    
//     return (
//         <>
//         <header class="font-hostgrotesk fixed z-20 w-full flex flex-col">
//             <div class="bg-primary-700 py-3 px-4 sm:px-8 lg:px-16 text-center flex gap-x-3 justify-center text-label-medium sm:text-label-large">
//                 <p class="text-primary-base">
//                     <span>Gratis Ongkir untuk Seluruh Wilayah Banten!</span>
//                     <span><Link href="#" class="ml-3 underline text-primary-50">Pesan sekarang</Link></span>
//                 </p>
//             </div>

//             <div class="h-[100px] px-4 sm:px-6 lg:px-12 py-3 border-b bg-custom-neutral-950 border-gray-100 flex items-center justify-between shadow-header">                    
//                 <Link href="/" class="h-full w-full max-w-[200px] text-2xl font-serif text-gray-800">
//                     <Logo class="h-full object-contain object-left" />
//                 </Link>

//                 <nav class="hidden lg:flex justify-center items-center gap-14 *:w-max *:text-label-medium *:sm:text-label-large *:text-custom-neutral-200">
//                     <Link href="/">Beranda</Link>
//                     <Link href="/#koleksi-terbaru">Koleksi Terbaru</Link>
//                     <DropdownMenu label="Koleksi Lainnya">
//                         <MenuItem
//                             judul="Baju"
//                             deskripsi="Baju untuk aktivitas sehari-hari sampai ngantor."
//                             href="/koleksi/baju"
//                         >
//                             <Tshirt alt="Baju" q:slot="img" />
//                         </MenuItem>

//                         <MenuItem
//                             judul="Celana"
//                             deskripsi="Potongan celana yang nyaman dan elegan, cocok untuk segala momen."
//                             href="/koleksi/celana"
//                         >
//                             <Pants alt="Celana" q:slot="img" />
//                         </MenuItem>

//                         <MenuItem
//                             judul="Sepatu"
//                             deskripsi="Koleksi alas kaki yang dirancang untuk menunjang kenyamanan dan gayamu."
//                             href="/koleksi/sepatu"
//                         >
//                             <Shoes alt="Sepatu" q:slot="img" />
//                         </MenuItem>

//                         <MenuItem
//                             judul="Aksesoris"
//                             deskripsi="Detail kecil yang akan membuat penampilanmu terlihat sempurna."
//                             href="/koleksi/aksesoris"
//                         >
//                             <Sunglasses alt="Aksesoris" q:slot="img" />
//                         </MenuItem>
//                     </DropdownMenu>
//                 </nav>

//                 <div class="w-full max-w-[200px] flex items-center justify-end gap-4 *:p-2 *:cursor-pointer *:rounded-2xl *:text-custom-neutral-100 *:hover:bg-primary-50">
//                     <button onClick$={toggleModal}>
//                         <LuSearch class="w-6 h-6 stroke-[1.5px]" />
//                     </button>
                    
//                     <button onClick$={() => window.open('https://api.whatsapp.com/send/?phone=+6287824125294&text=Halo Amara Fashion.')}>
//                         <LuMessageCircle class="w-6 h-6 stroke-[1.5px]" />
//                     </button>

//                     <button 
//                         class="lg:hidden p-1 hover:text-gray-600"
//                         onClick$={toggleMenu}
//                         aria-label="Toggle Menu"
//                     >
//                         <LuMenu class="w-6 h-6" />
//                     </button>
//                 </div>
//             </div>

//             <div 
//                 class={[
//                     "fixed top-0 left-0 w-full h-full bg-white transition-transform duration-300 transform lg:hidden z-40",
//                     isMenuOpen.value ? "translate-x-0" : "-translate-x-full"
//                 ]}
//             >
//                 <div class="h-full p-6 flex flex-col gap-4 pt-6">
//                     <div class="flex justify-between *:cursor-pointer">
//                         <Link href="/" class="h-full text-2xl font-serif text-gray-800">
//                             <Logo class="h-fit w-20 object-contain object-left" />
//                         </Link>
                    
//                         <button
//                                 class="lg:hidden p-1 hover:text-gray-600"
//                                 onClick$={toggleMenu}
//                                 aria-label="Toggle Menu"
//                             >
//                             <LuX class="w-6 h-6" />
//                         </button>
//                     </div>
//                     <nav class="h-full flex flex-col justify-center items-center gap-4 *:text-label-medium *:sm:text-label-large *:text-custom-neutral-200">
//                         <Link href="/">Beranda</Link>
//                         <Link href="/#koleksi-terbaru">Koleksi Terbaru</Link>
//                         <DropdownMenu label="Koleksi Lainnya">
//                             <MenuItem
//                                 judul="Baju"
//                                 deskripsi="Baju untuk aktivitas sehari-hari sampai ngantor."
//                                 href="/koleksi/baju"
//                             >
//                                 <Tshirt alt="Baju" q:slot="img" />
//                             </MenuItem>

//                             <MenuItem
//                                 judul="Celana"
//                                 deskripsi="Potongan celana yang nyaman dan elegan, cocok untuk segala momen."
//                                 href="/koleksi/celana"
//                             >
//                                 <Pants alt="Celana" q:slot="img" />
//                             </MenuItem>

//                             <MenuItem
//                                 judul="Sepatu"
//                                 deskripsi="Koleksi alas kaki yang dirancang untuk menunjang kenyamanan dan gayamu."
//                                 href="/koleksi/sepatu"
//                             >
//                                 <Shoes alt="Sepatu" q:slot="img" />
//                             </MenuItem>

//                             <MenuItem
//                                 judul="Aksesoris"
//                                 deskripsi="Detail kecil yang akan membuat penampilanmu terlihat sempurna."
//                                 href="/koleksi/aksesoris"
//                             >
//                                 <Sunglasses alt="Aksesoris" q:slot="img" />
//                             </MenuItem>
//                         </DropdownMenu>
//                     </nav>
//                 </div>
//             </div>
//         </header>

//         <SearchModal isOpen={isSearchModalOpen} {...props} />
//         </>
//     );
// });