import { LevelUpProvider } from '@/components/character/player/levelUp';
import { ReactNode } from 'react';

export default async function HomeLayout({ children }:{ children: ReactNode; }) {
  return <LevelUpProvider>{children}</LevelUpProvider>;
}