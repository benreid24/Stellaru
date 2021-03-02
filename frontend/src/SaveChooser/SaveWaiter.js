import React, {useState, useEffect} from 'react';

import BackButton from './BackButton';
import LoadingDots from 'LoadingDots';
import {translate} from 'Translator';

const State = Object.freeze({Waiting: 0, Prompted: 1});

function waitSave(onResult) {
    fetch(window.location.pathname + 'api/wait_save')
        .then(response => response.json())
        .then(data => {
            onResult(data);
        });
}

function Prompt(props) {
    const name = props.name;
    const date = props.date;
    const onChoose = props.onConfirm;

    return (
        <div className='savePrompt'>
            <h2 className='savePromptTitle'>{translate('Save Detected')}</h2>
            <h3 className='savePromptName'>{name}</h3>
            <p className='savePromptDate'>{date}</p>
            <div className='row'>
                <div className='col'>
                    <div className='row'>
                        <div className='col'/>
                        <div className='col-xl-6 col-lg-7 col-md-8 col-sm-10 align-self-center savePromptButtonOuter'>
                            <div className='savePromptButton' onClick={() => onChoose(true)}>
                                <h3 className='savePromptYes'>{translate('Load Save')}</h3>
                            </div>
                        </div>
                        <div className='col'/>
                    </div>
                </div>
                <div className='col'>
                    <div className='row'>
                        <div className='col'/>
                        <div className='col-xl-6 col-lg-7 col-md-8 col-sm-10 align-self-center savePromptButtonOuter'>
                            <div className='savePromptButton' onClick={() => onChoose(false)}>
                                <h3 className='savePromptNo'>{translate('Keep Waiting')}</h3>
                            </div>
                        </div>
                        <div className='col'/>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SaveWaiter(props) {
    const onSave = props.onSave;
    const onBack = props.onBack;

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
                <BackButton onClick={onBack}/>
                <h1 className='error'>{translate('Error')}</h1>
                <p className='error'>{error}</p>
            </div>
        );
    }

    return (
        <div className='container-fluid h-100'>
            <BackButton onClick={onBack}/>
            <h1 className="saveWaitHeader">{translate('Waiting For New Save')}</h1>
            {state === State.Waiting && <p>{translate('Watching Stellaris save directories')}<LoadingDots/></p>}
            {state === State.Prompted &&
                <div className='row'>
                    <div className='col'/>
                    <div className='col-xl-6 col-lg-8 col-md-10 col-sm-12 align-self-center'>
                        <Prompt
                            name={save.name}
                            date={save.gameDate}
                            onConfirm={onPromptResult}
                        />
                    </div>
                    <div className='col'/>
                </div>
            }
        </div>
    );
}

export default SaveWaiter;
