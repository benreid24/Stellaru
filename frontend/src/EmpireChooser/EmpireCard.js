import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import './EmpireChooser.css';

function EmpireCard(props) {
    const empire = props.empire;
    const onClick = props.onClick;
    const textClass = (props.empire.player === 'AI' ? 'ai' : 'player') + 'CardText';

    return (
        <Card key={empire.name} onClick={() => {onClick(empire.id)}} className="empireCard noselect">
            <CardContent>
                <h2 className={textClass}>{empire.name}</h2>
                <p className='empirePlayer'>{empire.player}</p>
            </CardContent>
        </Card>
    )
}

export default EmpireCard;
