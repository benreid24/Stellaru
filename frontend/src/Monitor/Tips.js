import React from 'react';
import {useState, useEffect} from 'react';

import {shuffle} from './Charts/Util';

const TipList = [
    'The slider in the top rate can be moved to adjust the dates of data shown',
    'Most charts are interactive, trying clicking on the legend labels',
    'Create a custom dashboard with your favorite charts in the "Custom" tab',
    'All your changes to charts will persist, so everything will be as you left it when you reopen Stellaru',
    'Stellaru works for multiplayer as well, visit the Help tab to learn how',
];
const makeList = () => {
    let list = [];
    for (let i = 0; i < TipList.length; i += 1) list.push(i);
    return list;
}
const list = makeList();
const TipOrder = shuffle(list);

function Tips(props) {
    const [currentTip, setCurrentTip] = useState(0);

    const updateTip = () => {
        let newTip = currentTip + 1;
        if (newTip > TipOrder.length)
            newTip = 0;
        setCurrentTip(newTip);
    }

    useEffect(() => {
        setTimeout(updateTip, 30000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTip]);

    return (
        <div className='tipBox tabRow'>
            <p className='tip'>{TipList[TipOrder[currentTip]]}</p>
        </div>
    );
}

export default Tips;
