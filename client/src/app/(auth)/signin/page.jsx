import React from 'react';
import SigninForm from './SigninForm';

const SigninPage = async({searchParams}) => {;
    const {redirect} = await searchParams || '/';
    
    return (
        <div>
            <SigninForm redirectTo={redirect}></SigninForm>
        </div>
    );
};

export default SigninPage;