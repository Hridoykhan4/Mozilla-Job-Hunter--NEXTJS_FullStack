import React from 'react';

const SuccessPlanPage = async ({searchParams}) => {
    const { session_id } = await searchParams;

    if (!session_id)
        throw new Error('Please provide a valid session_id (`cs_test_...`)');


    return (
        <div>
            
        </div>
    );
};

export default SuccessPlanPage;