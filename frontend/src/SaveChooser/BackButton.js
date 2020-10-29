import React from 'react';

import {translate} from '../Translator';

function BackButton(props) {
    const onClick = props.onClick;

    return (
        <div className='backButton' onClick={onClick}>
            <h2 className='backButtonText noselect'>{translate('Back')}</h2>
        </div>
    );
}

export default BackButton;
