import Link from 'next/link';

const Header = () => {
  return (
    <header className=''>
      <nav className='container flex gap-4 justify-center p-5 border-b-[1px] border-b-gray-600 text-xl font-medium capitalize'>
        <Link href={'/'}>home</Link>
        <Link href={'/login'}>login</Link>
        <Link href={'/register'}>register</Link>
      </nav>
    </header>
  );
};

export default Header;
