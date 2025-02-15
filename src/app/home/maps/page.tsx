// pages/index.tsx
"use client";
import CollaborativeGrid from '@/components/maps/mapEditor';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Collaborative Map Editor</h1>
      <CollaborativeGrid />
    </div>
  );
};

export default Home;
