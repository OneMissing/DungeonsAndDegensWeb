"use client";
import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase';

type User = {
    id: number;
    username: string;
};

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>(''); 
    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const { data, error } = await supabase.from('users').select('id, username');  
                if(error) {
                    throw error;
                } if(data) {
                    setUsers(data);
                }
            } catch(err) {
            setError('Error fetching users: ');
            } finally {
                setLoading(false);
            }
        };    
        fetchUsers();
    }, []); 
    if (loading) {
      return <div>Loading...</div>;
    }   
    if (error) {
      return <div>Error: {error}</div>;
    }   
    return (
      <div>
        <h2>User Table</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                    </tr>
            ))}
            </tbody>
        </table>
      </div>
    );
};

export default UserTable;
