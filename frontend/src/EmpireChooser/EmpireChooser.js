import React from 'react';

class EmpireChooser extends React.Component {
    constructor(props) {
        super(props);

        fetch(
            'api/empires', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({file: props.file})
            }
        ).then(response => response.json()).then(data => console.log(data));
    }

    render() {
        return (
            <div>
                <h1>Select Empire to Monitor</h1>
                <p>Loading...</p>
            </div>
        );
    }
}

export default EmpireChooser;
