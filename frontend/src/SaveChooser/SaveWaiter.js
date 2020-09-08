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

function Prompt(props) {
    const name = props.name;
    const date = props.date;
    const fileTime = props.fileTime;
    const onChoose = props.onConfirm;

    return (
        <div className='savePrompt'>
            <h2 className='savePromptTitle'>Save Found</h2>
            <h3 className='savePromptName'>{name}</h3>
            <p className='savePromptDate'>{date}</p>
            <p className='savePromptFileTime'>{fileTime}</p>
            <div className='row'>
                <div className='col'>
                    <div className='savePromptButtonWrapper'>
                        <div className='savePromptButton' onClick={() => onChoose(true)}>
                            <h3 className='savePromptYes'>Load Save</h3>
                        </div>
                    </div>
                </div>
                <div className='col'>
                    <div className='savePromptButtonWrapper'>
                        <div className='savePromptButton' onClick={() => onChoose(false)}>
                            <h3 className='savePromptNo'>Keep Waiting</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SaveWaiter(props) {
    const onSave = props.onSave;
    const [state, setState] = useState(State.Waiting);
    const [save, setSave] = useState(null);
    const [error, setError] = useState(null);

    const onResult = save => {
        if ('save' in save) {
            setSave(save['save']);
            setState(State.Prompted);
        }
        else {
            if ('error' in save)
                setError(save['error']);
            else
                setError(`Unknown error: ${save}`);
        }
    };

    const onPromptResult = (accepted) => {
        if (accepted) {
            onSave(save);
        }
        else {
            setState(State.Waiting);
        }
    }

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
            <h1 className="saveWaitHeader">Waiting For New Save</h1>
            {state === State.Waiting && <p>Watching Stellaris save directories<LoadingDots/></p>}
            {state === State.Prompted &&
                <div className='row'>
                    <div className='col-xl-6 col-lg-8 col-md-10 col-sm-12 align-self-center'>
                        <Prompt
                            name={save.name}
                            date={save.gameDate}
                            fileDate={save.fileDatetime}
                            onConfirm={onPromptResult}
                        />
                    </div>
                </div>
            }
        </div>
    );
}

export default SaveWaiter;
