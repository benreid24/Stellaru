import React, {useState, useEffect} from 'react';

import LoadingDots from '../LoadingDots';

const State = Object.freeze({Waiting: 0, Prompted: 1});

function waitSave(onResult) {
    fetch('api/wait_save')
        .then(response => response.json())
        .then(data => {
            onResult(data);
        });
}

function SaveWaiter(props) {
    const onSave = props.onSave;
    const [state, setState] = useState(State.Waiting);
    const [error, setError] = useState(null);

    const onResult = save => {
        console.log(save);
        if ('save' in save) {
            // TODO - Date?
            onSave(save['save']);
        }
        else {
            if ('error' in save)
                setError(save['error']);
            else
                setError(`Unknown error: ${save}`);
        }
    };

    useEffect(() => {
        if (state === State.Waiting) {
            waitSave(onResult);
        }
    }, [state]);

    if (error !== null) {
        return (
            <div className='container-fluid h-100'>
                <h1 className='error'>Error</h1>
                <p className='error'>{error}</p>
            </div>
        );
    }

    return (
        <div className='container-fluid h-100'>
            <h1 className="saveChooseHeader">Waiting For New Save</h1>
            <p>Watching Stellaris save directories<LoadingDots/></p>
        </div>
    );
}

export default SaveWaiter;
