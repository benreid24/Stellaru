import React, {useState, useEffect} from 'react';

function LoadingDots(props) {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const update = () => {
            let newDots = dots + '.';
            if (newDots.length > 3)
                newDots = '';
            setDots(newDots);
        };

        let handle = setTimeout(update, 900);
        return () => {clearTimeout(handle);};
    });

    return (
        <span>{dots}</span>
    );
}

export default LoadingDots;
