// import {
//   type EnhancedMenu,
//   type EnhancedMenuItem,
//   useIsHomePath,
// } from '~/lib/utils';
import {useParams, Form, Await, useMatches} from '@remix-run/react';
// import { useWindowScroll } from 'react-use';
// import { Disclosure } from '@headlessui/react';
import {Suspense, useEffect, useMemo} from 'react';
// import { useIsHydrated } from '~/hooks/useIsHydrated';
// import logo from '../../public/logo.svg'; // Tell webpack this JS file uses this image
// import logodark from '../../public/logo-dark.svg'; // Tell webpack this JS file uses this image
// import FooterMenu from './FooterMenu'
// import NewsletterSignup from './NewsletterSignup'
// import IconLink from './IconLink';
// import { FaInstagram } from 'react-icons/fa';
// import { FaDiscord } from 'react-icons/fa';
// import { FaTwitch } from 'react-icons/fa';
// import { FaYoutube } from 'react-icons/fa';
// import { FaFacebook } from 'react-icons/fa';
// console.log(logo); // /logo.84287d09.png
// console.log(logodark); // /logo.84287d09.png

// import type { LayoutData } from '../root';
import {useLocation} from 'react-router-dom';
import {Footer} from './Footer';
import {Header} from './Header';
import type {LayoutData} from '~/root';

export function Layout({
  children,
  layout,
}: {
  children: React.ReactNode;
  layout: LayoutData;
}) {
  const [root] = useMatches();
  const location = useLocation();

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <Suspense>
          <Await resolve={root.data?.cart}>
            {(cart) => (
              <Header
                cartCount={cart?.totalQuantity || 0}
                url={location.pathname + '/' + location.search}
              />
            )}
          </Await>
        </Suspense>
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}

// function Header({ title, menu }: { title: string; menu?: EnhancedMenu }) {
//   const isHome = useIsHomePath();

//   const {
//     isOpen: isCartOpen,
//     openDrawer: openCart,
//     closeDrawer: closeCart,
//   } = useDrawer();

//   const {
//     isOpen: isMenuOpen,
//     openDrawer: openMenu,
//     closeDrawer: closeMenu,
//   } = useDrawer();

//   const addToCartFetchers = useCartFetchers('ADD_TO_CART');

//   // toggle cart drawer when adding to cart
//   useEffect(() => {
//     if (isCartOpen || !addToCartFetchers.length) return;
//     openCart();
//   }, [addToCartFetchers, isCartOpen, openCart]);

//   return (
//     <>
//       <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
//       {menu && (
//         <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
//       )}
//       <DesktopHeader
//         isHome={isHome}
//         title={title}
//         menu={menu}
//         openCart={openCart}
//       />
//       <MobileHeader
//         isHome={isHome}
//         title={title}
//         openCart={openCart}
//         openMenu={openMenu}
//       />
//     </>
//   );
// }

// function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
//   const [root] = useMatches();

//   return (
//     <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
//       <div className="grid">
//         <Suspense fallback={<CartLoading />}>
//           <Await resolve={root.data?.cart}>
//             {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
//           </Await>
//         </Suspense>
//       </div>
//     </Drawer>
//   );
// }

// export function MenuDrawer({
//   isOpen,
//   onClose,
//   menu,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   menu: EnhancedMenu;
// }) {
//   return (
//     <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
//       <div className="grid">
//         <MenuMobileNav menu={menu} onClose={onClose} />
//       </div>
//     </Drawer>
//   );
// }

// function MenuMobileNav({
//   menu,
//   onClose,
// }: {
//   menu: EnhancedMenu;
//   onClose: () => void;
// }) {
//   const location = useLocation()
//   const isPatches = location.pathname.includes('/patches');
//   const isGettingStarted = location.pathname.includes('/getting-started');
//   const isModules = location.pathname.includes('/modules');
//   const isInStock = location.search.includes('available=true');
//   const isCatalog = !isPatches && !isGettingStarted && !isModules && !isInStock;

//   return (
//     <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
//       {/* Top level menu items */}
//       <span className="block">
//         <Link
//           to="/"
//           onClick={onClose}
//           className={
//             isCatalog ? 'pb-1 border-b -mb-px' : 'pb-1'
//           }
//         >
//           <Text color={isCatalog ? 'primary' : 'subtle'} as="span" size="copy">
//             Catalog
//           </Text>
//         </Link>
//       </span>
//       <span className="block">
//         <Link
//           to="/?available=true"
//           onClick={onClose}
//           className={
//             isInStock ? 'pb-1 border-b -mb-px' : 'pb-1'
//           }
//         >
//           <Text color={isInStock ? 'primary' : 'subtle'} as="span" size="copy">
//             In Stock
//           </Text>
//         </Link>
//       </span>
//       <span className="block">
//         <Link
//           to="/patches"
//           onClick={onClose}
//           className={
//             isPatches ? 'pb-1 border-b -mb-px' : 'pb-1'
//           }
//         >
//           <Text color={isPatches ? 'primary' : 'subtle'} as="span" size="copy">
//             Patches
//           </Text>
//         </Link>
//       </span>
//       <span className="block">
//         <Link
//           to="/getting-started"
//           onClick={onClose}
//           className={
//             isGettingStarted ? 'pb-1 border-b -mb-px' : 'pb-1'
//           }
//         >
//           <Text color={isGettingStarted ? 'primary' : 'subtle'} as="span" size="copy">
//             Getting Started
//           </Text>
//         </Link>
//       </span>
//       <span className="block">
//         <Link
//           to="/modules"
//           onClick={onClose}
//           className={
//             isModules ? 'pb-1 border-b -mb-px' : 'pb-1'
//           }
//         >
//           <Text color={isModules ? 'primary' : 'subtle'} as="span" size="copy">
//             Module List
//           </Text>
//         </Link>
//       </span>
//       <span className="block">
//         <Link
//           to="https://lzxmodular.rtfd.io"
//           target="_blank"
//           className={
//              'pb-1'
//           }
//         >
//           <Text color={'subtle'} as="span" size="copy">
//             Docs
//           </Text>
//         </Link>
//       </span>
//       {/* {(menu?.items || []).map((item) => (
//         <span key={item.id} className="block">
//           <Link
//             to={item.to}
//             target={item.target}
//             onClick={onClose}
//             className={({ isActive }) =>
//               isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
//             }
//           >
//             <Text as="span" size="copy">
//               {item.title}
//             </Text>
//           </Link>
//         </span>
//       ))} */}
//     </nav>
//   );
// }

// function MobileHeader({
//   title,
//   isHome,
//   openCart,
//   openMenu,
// }: {
//   title: string;
//   isHome: boolean;
//   openCart: () => void;
//   openMenu: () => void;
// }) {
//   // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

//   const params = useParams();
//   const isDark = false;

//   return (
//     <header
//       role="banner"
//       className={`${isHome
//         ? 'bg-contrast/80 text-primary'
//         : 'bg-contrast/80 text-primary'
//         } flex lg:hidden items-center sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
//     >
//       <div className="flex items-center justify-start w-full gap-4">
//         <button
//           onClick={openMenu}
//           className="relative flex items-center justify-center w-8 h-8"
//         >
//           <IconMenu />
//         </button>
//         <Form
//           method="get"
//           action={params.lang ? `/${params.lang}/search` : '/search'}
//           className="items-center gap-2 sm:flex"
//         >
//           <button
//             type="submit"
//             className="relative flex items-center justify-center w-8 h-8"
//           >
//             <IconSearch />
//           </button>
//           <Input
//             className={
//               isHome
//                 ? 'focus:border-primary/20'
//                 : 'focus:border-primary/20'
//             }
//             type="search"
//             variant="minisearch"
//             placeholder="Search"
//             name="q"
//           />
//         </Form>
//       </div>

//       <Link
//         className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
//         to="/"
//       >

//         <img className="h-8 min-h-8 dark:hidden light:visible" src={logo} alt="Logo" />
//         <img className="h-8 min-h-8 light:hidden dark:visible" src={logodark} alt="Logo" />
//       </Link>

//       <div className="flex items-center justify-end w-full gap-4">
//         <AccountLink className="relative flex items-center justify-center w-8 h-8" />
//         <CartCount isHome={isHome} openCart={openCart} />
//       </div>
//     </header>
//   );
// }

// function DesktopHeader({
//   isHome,
//   menu,
//   openCart,
//   title,
// }: {
//   isHome: boolean;
//   openCart: () => void;
//   menu?: EnhancedMenu;
//   title: string;
// }) {
//   const location = useLocation()
//   const isPatches = location.pathname.includes('/patches');
//   const isGettingStarted = location.pathname.includes('/getting-started');
//   const isModules = location.pathname.includes('/modules');
//   const isInStock = location.search.includes('available=true');
//   const isCatalog = !isPatches && !isGettingStarted && !isModules && !isInStock;
//   const isDark = false;
//   const params = useParams();
//   const { y } = useWindowScroll();
//   return (
//     <header
//       role="banner"
//       className={`${isHome
//         ? 'bg-contrast/80 text-primary'
//         : 'bg-contrast/80 text-primary'
//         } ${!isHome && y > 50 && ' shadow-lightHeader'
//         } hidden lg:flex items-center sticky transition duration-300 backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-8 px-12 py-4`}
//     >
//       <div className="flex gap-12 items-center justify-center">
//         <nav className="flex gap-8 items-center justify-center">
//           <Link to="/" prefetch="intent">
//             <img className="h-8 min-h-8 dark:hidden light:visible" src={logo} alt="Logo" />
//             <img className="h-8 min-h-8 light:hidden dark:visible" src={logodark} alt="Logo" />
//           </Link>
//           <Link
//             to="/"
//             prefetch="intent"
//             className={isCatalog ? 'pb-1 border-b -mb-px' : 'pb-1'}
//           >
//             <Text color={isCatalog ? 'primary' : 'subtle'}>Catalog</Text>
//           </Link>
//           <Link
//             to="/?available=true"
//             prefetch="intent"
//             className={isInStock ? 'pb-1 border-b -mb-px' : 'pb-1'}
//           >
//             <Text color={isInStock ? 'primary' : 'subtle'}>In Stock</Text>
//           </Link>

//           <Link
//             to="/patches"
//             prefetch="intent"
//             className={isPatches ? 'pb-1 border-b -mb-px' : 'pb-1'}
//           >
//             <Text color={isPatches ? 'primary' : 'subtle'}>Patches</Text>
//           </Link>
//           <Link
//             to="/getting-started"
//             prefetch="intent"
//             className={isGettingStarted ? 'pb-1 border-b -mb-px' : 'pb-1'}
//           >
//             <Text color={isGettingStarted ? 'primary' : 'subtle'}>Getting Started</Text>
//           </Link>
//           <Link
//             to="/modules"
//             prefetch="intent"
//             className={isModules ? 'pb-1 border-b -mb-px' : 'pb-1'}
//           >
//             <Text color={isModules ? 'primary' : 'subtle'}>Module List</Text>
//           </Link>
//           <Link
//             to="https://lzxmodular.rtfd.io"
//             target="_blank"
//             className={'pb-1'}
//           >
//             <Text color={'subtle'}>Docs</Text>
//           </Link>
//         </nav>
//       </div>
//       <div className="flex items-center gap-1">
//         <Form
//           method="get"
//           action={params.lang ? `/${params.lang}/search` : '/search'}
//           className="flex items-center gap-2"
//         >
//           <Input
//             className={
//               isHome
//                 ? 'focus:border-contrast/20 dark:focus:border-primary/20'
//                 : 'focus:border-primary/20'
//             }
//             type="search"
//             variant="minisearch"
//             placeholder="Search"
//             name="q"
//           />
//           <button
//             type="submit"
//             className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
//           >
//             <IconSearch />
//           </button>
//         </Form>
//         <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
//         <CartCount isHome={isHome} openCart={openCart} />
//       </div>
//     </header>
//   );
// }

// function AccountLink({ className }: { className?: string }) {
//   const [root] = useMatches();
//   const isLoggedIn = root.data?.isLoggedIn;
//   return isLoggedIn ? (
//     <Link to="/account" className={className}>
//       <IconAccount />
//     </Link>
//   ) : (
//     <Link to="/account/login" className={className}>
//       <IconLogin />
//     </Link>
//   );
// }

// function CartCount({
//   isHome,
//   openCart,
// }: {
//   isHome: boolean;
//   openCart: () => void;
// }) {
//   const [root] = useMatches();

//   return (
//     <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
//       <Await resolve={root.data?.cart}>
//         {(cart) => (
//           <Badge
//             dark={isHome}
//             openCart={openCart}
//             count={cart?.totalQuantity || 0}
//           />
//         )}
//       </Await>
//     </Suspense>
//   );
// }

// function Badge({
//   openCart,
//   dark,
//   count,
// }: {
//   count: number;
//   dark: boolean;
//   openCart: () => void;
// }) {
//   const isHydrated = useIsHydrated();

//   const BadgeCounter = useMemo(
//     () => (
//       <>
//         <IconBag />
//         <div
//           className={`${dark
//             ? 'text-primary bg-primary dark:text-contrast dark:bg-primary'
//             : 'text-contrast bg-primary'
//             } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
//         >
//           <span>{count || 0}</span>
//         </div>
//       </>
//     ),
//     [count, dark],
//   );

//   return isHydrated ? (
//     <button
//       onClick={openCart}
//       className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
//     >
//       {BadgeCounter}
//     </button>
//   ) : (
//     <Link
//       to="/cart"
//       className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
//     >
//       {BadgeCounter}
//     </Link>
//   );
// }
