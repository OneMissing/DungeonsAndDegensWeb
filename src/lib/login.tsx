import supabase from './supabase';
import crypto from 'crypto';

export default function login(inputPassword: string, storedHash: string): boolean {
    const [salt, originalHash] = storedHash.split(':');
    const hash = crypto.pbkdf2Sync(inputPassword, salt, 100000, 64, 'sha256').toString('hex');
    return hash === originalHash;
  }

  import { useState } from 'react';
