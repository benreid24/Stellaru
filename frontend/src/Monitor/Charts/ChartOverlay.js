import React, {useState} from 'react';

function ChartOverlay(props) {
    const settings = props.settings;

    const [visible, setVisible] = useState(false);

    if (!settings) {
        console.log('wtf');
        return null;
    }

    const onDelete = settings.onDelete;
    const onResizeBigger = () => settings.onResize(true);
    const onResizeSmaller = () => settings.onResize(false);
    const onMoveUp = () => settings.onMove(true);
    const onMoveDown = () => settings.onMove(false);

    if (!visible) {
        return (
            <div
                className='chartOverlayTriggerArea'
                onClick={() => setVisible(true)}>
                <h1 className='chartOverlayDots noselect'>...</h1>
            </div>
        );
    }

    return (
        <div className='chartOverlay' onMouseLeave={() => setVisible(false)}>
            <img src='uparrow.png' className='chartOverlayButton' alt='Move up' title='Move up' onClick={onMoveUp}/>
            <img src='downarrow.png' className='chartOverlayButton' alt='Move down' title='Move down' onClick={onMoveDown}/>
            <img src='smaller.png' className='chartOverlayButton' alt='Make smaller' title='Make smaller' onClick={onResizeSmaller}/>
            <img src='bigger.png' className='chartOverlayButton' alt='Make bigger' title='Make bigger' onClick={onResizeBigger}/>
            <img src='x.png' className='chartOverlayButton' alt='Remove' title='Remove' onClick={onDelete}/>
        </div>
    )
}

export default ChartOverlay;
