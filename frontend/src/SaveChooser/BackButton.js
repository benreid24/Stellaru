import React from 'react';

function BackButton(props) {
    const onClick = props.onClick;

    return (
        <div className='backButton' onClick={onClick}>
            <h2 className='backButtonText noselect'>Back</h2>
        </div>
    );
}

export default BackButton;
