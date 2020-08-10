import React from 'react';
import {useState, useEffect} from 'react';

import EmpireCard from './EmpireCard';
import './EmpireChooser.css';

function LoadingDots(props) {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const update = () => {
            let newDots = dots + '.';
            if (newDots.length > 3)
                newDots = '';
            setDots(newDots);
        };

        let handle = setTimeout(update, 900);
        return () => {clearTimeout(handle);};
    });

    return (
        <span>{dots}</span>
    );
}

function EmpireChooser(props) {
    const [empires, setEmpires] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(
            'api/empires', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({file: props.file})
            }
        ).then(response => response.json()).then(data => setEmpires(data));
    }, [props.file]);

    const handleEmpireClick = (empireId) => {
        console.log(empireId);
    }

    const empireSortCmp = (a, b) => {
        if (a.player !== 'AI' && b.player === 'AI')
            return -1;
        if (a.player === 'AI' && b.player !== 'AI')
            return 1;
        if (a.name.toLowerCase() < b.name.toLowerCase())
            return -1;
        if (b.name.toLowerCase() < a.name.toLowerCase())
            return 1;
        return 0;
    }

    const renderEmpire = (empire) => {
        const rnd = Math.floor(Math.random() * 1000);
        const key = `${empire.name}${rnd}`;
        return (
            <div className='col-3 empireCardDiv' key={key}>
                <EmpireCard empire={empire} onClick={handleEmpireClick} />
            </div>
        );
    }

    let empireCards = [];
    if (empires !== null) {
        if (empires.hasOwnProperty('error')) {
            if (error === null)
                setError(`Error loading save: ${empires.error}`);
        }
        else {
            const empireList = empires.empires;
            empireList.sort(empireSortCmp);
            for (let i in empireList) {
                const empire = empireList[i];
                empireCards.push(renderEmpire(empire));
            }
        }
    }

    return (
        <div>
            <h1>Select Empire to Monitor</h1>
            {empires === null && <p>Loading save<LoadingDots/></p>}
            {empires !== null && error === null && 
                <div className="row empireChooserRow">
                    {empireCards}
                </div>
            }
            {error !== null && <p className="error">{error}</p>}
        </div>
    );
}

export default EmpireChooser;
