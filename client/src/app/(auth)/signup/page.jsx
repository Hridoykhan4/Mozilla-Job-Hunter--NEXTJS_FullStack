import React from 'react';
import SignupForm from './SignupForm';

const SignUpPage = async({searchParams}) => {
    const { redirect } = await searchParams || '/';

    return (
        <div>
            <SignupForm redirectTo={redirect} />;
        </div>
    );
};

export default SignUpPage;