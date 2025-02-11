import userLogged from '@/lib/check';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-900 w-full">
        <h1>Homepage</h1>
      {userLogged? "true":"false"}
    </div>
  );
}
