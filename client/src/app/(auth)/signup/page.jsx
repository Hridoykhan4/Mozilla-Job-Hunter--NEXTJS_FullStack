import React from 'react';
import SignupForm from './SignupForm';

const SignUpPage = () => {
    return (
        <div>
            <SignupForm redirectTo={'/'} />;
        </div>
    );
};

export default SignUpPage;