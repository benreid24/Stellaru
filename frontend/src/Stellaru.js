import React, {useState, useEffect} from 'react';
import {createMuiTheme} from '@material-ui/core'
import {ThemeProvider} from '@material-ui/core'

import './Stellaru.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import DataSubscription from './DataSubscription';
import SaveChooser from './SaveChooser/SaveChooser';
import EmpireChooser from './EmpireChooser/EmpireChooser';
import Monitor from './Monitor/Monitor';

import {init as initTranslator, getAllLangs, setLang as setGlobalLang, LanguagePicker} from 'Translator';

const State = Object.freeze({
    chooseSave: 0,
    chooseEmpire: 1,
    monitor: 2
});

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

const subscription = new DataSubscription();

function loadLang() {
    const stored = window.localStorage.getItem('stellaru-lang');
    let lang = 'english';
    if (stored !== null)
        lang = JSON.parse(stored);
    setGlobalLang(lang);
    return lang;
}

function Stellaru(props) {
    const [state, setState] = useState(State.chooseSave);
    const [chosenSave, setChosenSave] = useState(null);
    const [chosenEmpire, setChosenEmpire] = useState(null);

    const [allLangs, setAllLangs] = useState([]);
    const [lang, setLang] = useState('');
    const onLangChange = newLang => {
        setLang(newLang);
        setGlobalLang(newLang);
        window.localStorage.setItem('stellaru-lang', JSON.stringify(newLang));
    };
    const onTranslationLoad = () => {
        setAllLangs(getAllLangs());
        setLang(loadLang());
    }
    useEffect(() => {
        initTranslator(onTranslationLoad);
    }, []);

    const onSaveChoose = (save) => {
        setChosenSave(save);
        setState(State.chooseEmpire);
    };

    const onEmpireChoose = (empire) => {
        setChosenEmpire(empire);
        setState(State.monitor);
        subscription.setChosenInfo(chosenSave.file, empire.id);
    };

    const onGoBack = () => {
        setState(State.chooseSave);
        setChosenSave(null);
        setChosenEmpire(null);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="Stellaru">
                {state === State.chooseSave && <LanguagePicker onChange={onLangChange} lang={lang} langs={allLangs}/>}
                {state === State.chooseSave && <SaveChooser onChoose={onSaveChoose}/>}
                {state === State.chooseEmpire && <EmpireChooser file={chosenSave.file} onChoose={onEmpireChoose}/>}
                {state === State.monitor && <Monitor save={chosenSave} empire={chosenEmpire} subscription={subscription} onBack={onGoBack}/>}
            </div>
        </ThemeProvider>
    );
}

export default Stellaru;
