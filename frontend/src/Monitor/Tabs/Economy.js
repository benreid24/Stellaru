import React from 'react';

import AllResourceIncomes from '../Charts/Economy/AllResourceIncomes';
import Stockpiles from '../Charts/Economy/Stockpiles';
import MegaBreakdown from '../Charts/Economy/MegaBreakdown';
import Gdp from '../Charts/Economy/Gdp';
import MarketPrices from '../Charts/Economy/MarketPrices';
import ResourceValues from '../Charts/Economy/ResourceValues';

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
