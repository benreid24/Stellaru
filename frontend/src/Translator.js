import React, {useState, useEffect} from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

let translations = {};
let currentLang = 'english';
let keys = [];

function init(doneCb) {
    fetch(window.location.pathname + 'api/translations')
        .then(response => response.json())
        .then(data => {
            if ('translations' in data) {
                translations = data['translations'];
                doneCb();
            }
            else {
                console.log(`Bad translation data: ${translations}`);
            }
        });
}

function translate(phrase) {
    if (!keys.includes(phrase)) {
        keys.push(phrase);
    }
    if (phrase in translations) {
        if (currentLang in translations[phrase])
            return translations[phrase][currentLang];
    }
    return phrase;
}

function setLang(lang) {
    currentLang = lang;
}

function getAllLangs() {
    let langs = [];
    for (const [, subLangs] of Object.entries(translations)) {
        for (const [lang,] of Object.entries(subLangs)) {
            if (langs.indexOf(lang) < 0)
                langs.push(lang);
        }
    }
    return langs;
}

function LanguagePicker(props) {
    const classes = useStyles();
    const langs = props.langs ? props.langs : ['english', 'spanish'];
    const onChange = props.onChange;

    const [lang, setLang] = useState(props.lang);
    const onLangChange = event => {
        const newLang = event.target.value;
        setLang(newLang);
        onChange(newLang);
    };
    useEffect(() => {
        if (lang !== props.lang)
            setLang(props.lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.lang]);

    const options = langs.map(lang => <MenuItem key={lang} value={lang}>{lang}</MenuItem>);
    return (
        <div className='langChooser'>
            <FormControl className={classes.formControl}>
                <Select value={lang} onChange={onLangChange}>
                    {options}
                </Select>
            </FormControl>
        </div>
    );
}

export {
    init,
    translate,
    setLang,
    getAllLangs,
    LanguagePicker
};
