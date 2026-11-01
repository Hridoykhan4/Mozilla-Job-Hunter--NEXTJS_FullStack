import { getUsersList } from '@/lib/api/users';
import React from 'react';

const AdminUsersPage = async() => { 
    const data = await getUsersList()
    console.log(data);
    return (
        <div>
            
        </div>
    );
};

export default AdminUsersPage;