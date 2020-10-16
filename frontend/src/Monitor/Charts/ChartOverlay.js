import React, {useState} from 'react';

function ChartOverlay(props) {
    const settings = props.settings;

    const [visible, setVisible] = useState(false);

    if (!settings) {
        return null;
    }

    const onDelete = settings.onDelete;
    const onResizeBigger = () => settings.onResize(true);
    const onResizeSmaller = () => settings.onResize(false);
    const onResizeTaller = () => settings.onHeight(true);
    const onResizeShorter = () => settings.onHeight(false);
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
            <div className='chartOverlayRow'>
                <img src='static/x.png' className='chartOverlayButton' alt='Remove' title='Remove' onClick={onDelete}/>
            </div>
            <div className='chartOverlayRow'>
                <img src='static/uparrow.png' className='chartOverlayButton' alt='Move up' title='Move up' onClick={onMoveUp}/>
                <img src='static/downarrow.png' className='chartOverlayButton' alt='Move down' title='Move down' onClick={onMoveDown}/>
            </div>
            <div className='chartOverlayRow'>
                <img src='static/narrower.png' className='chartOverlayButton' alt='Make narrower' title='Make narrower' onClick={onResizeSmaller}/>
                <img src='static/wider.png' className='chartOverlayButton' alt='Make wider' title='Make wider' onClick={onResizeBigger}/>
            </div>
            <div className='chartOverlayRow'>
                <img src='static/shorter.png' className='chartOverlayButton' alt='Make shorter' title='Make shorter' onClick={onResizeShorter}/>
                <img src='static/taller.png' className='chartOverlayButton' alt='Make taller' title='Make taller' onClick={onResizeTaller}/>
            </div>
        </div>
    )
}

export default ChartOverlay;
