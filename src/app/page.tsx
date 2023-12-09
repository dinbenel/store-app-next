import { currentUser } from '@clerk/nextjs';

export default async function Home() {
  const user = await currentUser();
  console.log(user);
  return <div className=''>Home</div>;
}
