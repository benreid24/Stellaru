import React from 'react';

import DefaultLegendContent from 'recharts/lib/component/DefaultLegendContent';
import {Scrollbars} from 'react-custom-scrollbars';

const AxisLabel = ({axisType, x, y, width, height, stroke, children, offset}) => {
    const isVert = axisType === 'yAxis';
    const cx = isVert ? x : x + (width / 2);
    const cy = isVert ? (height / 2) + y : y + height + 10;
    const rot = isVert ? `270 ${cx} ${cy}` : 0;
    return (
        <text x={cx} y={cy + offset} transform={`rotate(${rot})`} textAnchor="middle" stroke={stroke} fill='#dadada'>
            {children}
        </text>
    );
};

function RenderTooltip(props) {
    const payload = props.payload;
    const label = props.label;
    const formatter = props.formatter;

    const renderItem = item => {
        return (
            <p
                key={item.dataKey}
                className='tooltipItem'
                style={{color: item.color}}
            >
                {`${item.name}: ${formatter(item.value)}`}
            </p>
        );
    };
    const renderedItems = payload ? payload.map(renderItem) : [];

    const MaxRows = 12;
    const columnCount = Math.ceil(renderedItems.length / MaxRows);
    let columns = [];
    for (let i = 0; i<columnCount; i += 1) {
        columns.push(
            <div key={i} className='col-auto'>
                {renderedItems.slice(i * MaxRows, i * MaxRows + MaxRows)}
            </div>
        );
    }
    
    return (
        <div className='tooltipBox'>
            <p className='tooltipLabel'>{label}</p>
            <div className='row tooltipRow'>
                {columns}
            </div>
        </div>
    );
}

const ScrollableLegend = (props) => {
    delete props.content;

    return (
        <Scrollbars
            style={{
                width: '100%'
            }}
            autoHeight
            autoHeightMax={100}
            renderTrackHorizontal={() => <div/>}
            renderThumbHorizontal={() => <div/>}
        >
            <DefaultLegendContent {...props} layout='horizontal' />
        </Scrollbars>
    );
};

export {
    AxisLabel,
    RenderTooltip,
    ScrollableLegend
}
