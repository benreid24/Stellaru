import React from 'react';

function Help(props) {
    const connInfo = props.connInfo ? props.connInfo : {};
    const localIp = connInfo.local_ip ? connInfo.local_ip : '?';
    const externalIp = connInfo.external_ip ? connInfo.external_ip : '?';
    const port = connInfo.port ? connInfo.port : '?';

    const lanLink = connInfo ? `http://${localIp}:${port}` : '';
    const internetLink = connInfo ? `http://${externalIp}:${port}` : '';

    return (
        <div className='monitorTab helpPage'>
            <h2 className='helpTitle'>Multiplayer</h2>
            <h3 className='helpSubtitle'>Connection Info</h3>
            <p className='helpLabel'>Local IP: <span className='helpValue'>{localIp}</span></p>
            <p className='helpLabel'>Stellaru Port: <span className='helpValue'>{port}</span></p>
            <p className='helpLabel'>LAN Link: <a href={lanLink}>{lanLink}</a></p>
            <p className='helpLabel'>Internet Link: <a href={internetLink}>{internetLink}</a></p>
            <h3 className='helpSubtitle'>Instructions</h3>
            <ol>
                <li>
                    If your friends are not on your local network forward the port 42069 to your machine:
                    <ol>
                        <li>Navigate to your routers administration page. Likely something like <a href='192.168.1.1'>http://192.168.1.1</a></li>
                        <li>Find the port forwarding page</li>
                        <li>Forward external port <b>42069</b> to the Local IP and Stellaru Port (internal port) from above</li>
                    </ol>
                </li>
                <li>Give your friends the LAN Link if they are on your network, or the Internet Link if they are not</li>
            </ol>
        </div>
    )
}

export default Help;
