"use client";
import { useState } from 'react';
import axios from 'axios';

function UsernameForm() {
const [user_email, setUser_email] = useState<string>('');
const [user_password, setUser_password] = useState<string>('');

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

  }
}

export default UsernameForm;