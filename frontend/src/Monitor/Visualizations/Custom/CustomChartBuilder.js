import React from 'react';

import './Custom.css';

function CustomChartBuilder(props) {
    // TODO

    return (
        <div>
            <div className='row chartRow justify-content-center'>
                <div className='col-xl-6 col-md-8 col-xs-12'>
                    <div className='placeholder customChartArea'>
                        <p>Chart preview</p>
                    </div>
                </div>
            </div>
            <div className='row chartRow'>
                <div className='col-6'>
                    <div className='customPropsArea'>
                        <p>Chart properties</p>
                    </div>
                </div>
                <div className='col-6'>
                    <div className='customSeriesArea'>
                        <p>Series selectors</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomChartBuilder;
