import React, {useState, useEffect} from 'react';

import {MethodChooser, Methods} from './MethodChooser';
import SaveSelector from './SaveSelector';
import SaveWaiter from './SaveWaiter';

import './SaveChooser.css';

const State = Object.freeze({chooseMethod: 0, waitSave: 1, chooseSave: 2, choosePrevSave: 3, chooseActiveSave: 4});

function selectLatestSave(saves) {
    let ld = saves[0].fileDatetime;
    let ls = saves[0];
    for (let i = 1; i<saves.length; i += 1) {
        if (saves[i].fileDatetime > ld) {
            ld = saves[i].fileDatetime;
            ls = saves[i];
        }
    }
    return ls;
}

function SaveChooser(props) {
    const selectSave = props.onChoose;
    const [state, setState] = useState(State.chooseMethod);
    const [saves, setSaves] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('api/saves')
            .then(response => response.json())
            .then(data => {
                if ('saves' in data) {
                    const saves = data['saves'];
                    for (let i = 0; i<saves.length; i += 1) {
                        saves[i].fileDatetime = new Date(saves[i].fileDatetime);
                    }
                    saves.sort((a,b) => {
                        if (a.fileDatetime < b.fileDatetime)
                            return 1;
                        if (a.fileDatetime > b.fileDatetime)
                            return -1;
                        return 0;
                    });
                    setSaves(saves);
                }
                else {
                    setError(data['error']);
                }
            });
    }, []);

    const methodChose = (method) => {
        switch (method) {
            case Methods.wait:
                setState(State.waitSave);
                break;
            case Methods.choose:
                setState(State.chooseSave);
                break;
            case Methods.latest:
                selectSave(selectLatestSave(this.state.saves));
                break;
            case Methods.chooseExisting:
                setState(State.choosePrevSave);
                break;
            case Methods.chooseActive:
                setState(State.chooseActiveSave);
                break;
            default:
                console.log('Unknown state: ', method);
                break;
        }
    };

    if (error) {
        return (
            <div className="saveChooser">
                <h1 class='error'>Error</h1>
                <p class='error'>{error}</p>
            </div>
        );
    }

    return (
        <div className="saveChooser">
            {state === State.chooseMethod && <MethodChooser onchoose={methodChose}/>}
            {(state === State.chooseSave || state === State.choosePrevSave || state === State.chooseActiveSave) &&
                <SaveSelector
                    onchoose={selectSave}
                    saves={saves}
                    prevOnly={state === State.choosePrevSave}
                    activeOnly={state === State.chooseActiveSave}
                />
            }
            {state === State.waitSave && <SaveWaiter onSave={selectSave}/>}
        </div>
    );
}

export default SaveChooser;