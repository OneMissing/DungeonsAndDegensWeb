import { redirect } from 'next/navigation'

export default async function PrivatePage() {
  const handleLink = () => {redirect('/login')};
  return(
    <div className="flex items-center justify-center min-h-screen bg-red-900 w-full">
      <h1>Landing page</h1>
      <button onClick={handleLink()}>Get started</button>
    </div>
  );
}