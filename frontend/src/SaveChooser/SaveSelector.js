import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class SaveCard extends React.Component {
    constructor(props) {
        super(props);

        // TODO ?
    }

    render() {
        return (
            <Card className="saveCardDiv">
                <CardContent>
                        <h2 className="saveName noselect">Save Name</h2>
                        <div>
                            <p className="saveGameDate noselect">2200.12.25</p>
                            <p className="saveFileDatetime noselect">
                                <span className="saveFileDate">Aug 1 2020</span>
                                <span className="saveFileTime">9:30PM</span>
                            </p>
                        </div>
                </CardContent>
            </Card>
        );
    }
}

class SaveSelector extends React.Component {
    constructor(props) {
        super(props);
        // TODO
    }

    render() {
        return (
            <div>
                <h1 className="saveChooseHeader">Choose Game Save</h1>
                <div className="row">
                    <div className="col-3">
                        <SaveCard></SaveCard>
                    </div>
                </div>
            </div>
        );
    }
}

export default SaveSelector;
