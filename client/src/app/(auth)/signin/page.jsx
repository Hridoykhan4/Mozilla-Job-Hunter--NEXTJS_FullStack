import React from 'react';
import SigninForm from './SigninForm';

const SigninPage = () => {
    return (
        <div>
            <SigninForm redirectTo='/'></SigninForm>
        </div>
    );
};

export default SigninPage;