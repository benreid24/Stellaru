import React from 'react';

import AllResourceIncomes from 'Monitor/Visualizations/Economy/AllResourceIncomes';
import Stockpiles from 'Monitor/Visualizations/Economy/Stockpiles';
import MegaBreakdown from 'Monitor/Visualizations/Economy/MegaBreakdown';
import Gdp from 'Monitor/Visualizations/Economy/Gdp';
import MarketPrices from 'Monitor/Visualizations/Economy/MarketPrices';
import ResourceValues from 'Monitor/Visualizations/Economy/ResourceValues';

function Economy(props) {
    const data = props.data;

    return (
        <div className='monitorTab'>
            <div className='row chartRow'>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-3 presetChart'>
                    <MegaBreakdown data={data}/>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-3 presetChart'>
                    <AllResourceIncomes spending data={data}/>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-3 presetChart'>
                    <Stockpiles data={data}/>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 presetChart'>
                    <Gdp data={data}/>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 presetChart'>
                    <MarketPrices data={data}/>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 presetChart'>
                    <ResourceValues data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Economy;
