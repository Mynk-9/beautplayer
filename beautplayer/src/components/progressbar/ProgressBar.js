import { React, useEffect, useState, useContext, useRef } from 'react';
import Styles from './ProgressBar.module.scss';

import PlayerManager from '../playermanager';
import PlayerContext from './../playercontext';

const ProgressBar = props => {
    const { audioDuration, playPause } = useContext(PlayerContext);
    const [progressVal, setProgressVal] = useState(0);
    const [progressInterval, setProgressInterval] = useState(null);

    const playerManager = PlayerManager.getInstance();

    const convertSecondsToMinsSecs = (secs) => {
        if (isNaN(secs))
            return '-/-';

        let mins = parseInt(secs / 60);
        let mins_str = mins.toString(10);
        if (mins < 10)
            mins_str = '0' + mins_str;

        secs = parseInt(secs % 60);
        let secs_str = secs.toString(10);
        if (secs < 10)
            secs_str = '0' + secs_str

        return (mins_str + ':' + secs_str);
    };

    // garbage collection
    useEffect(() => {
        return () => {
            clearInterval(progressInterval);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setProgressVal(0);
    }, [audioDuration]);

    useEffect(() => {
        if (playPause === 'play') {
            setProgressVal(
                parseFloat(playerManager.getPlayer().currentTime / audioDuration * 100).toFixed(1)
            );
            setProgressInterval(
                setInterval(() => {
                    setProgressVal(
                        parseFloat(playerManager.getPlayer().currentTime / audioDuration * 100).toFixed(1)
                    );
                }, 1000)
            );
        } else {
            clearInterval(progressInterval);
            let _progressVal = parseFloat(playerManager.getPlayer().currentTime / audioDuration * 100).toFixed(1);
            if (isNaN(_progressVal))
                _progressVal = 0;
            setProgressVal(_progressVal);
        }
    }, [playPause]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleProgressBarInterrupt = (e) => {
        const val = e.target.value;
        let newTimeStamp = parseInt((val / 100) * audioDuration);

        setProgressVal(val);
        playerManager.getPlayer().currentTime = newTimeStamp;
    };

    return (
        <div className={Styles.progressBarContainer}>
            <span className={Styles.time}>
                {convertSecondsToMinsSecs(parseInt(progressVal / 100 * audioDuration))}
            </span>
            <input
                type={'range'}
                onInput={handleProgressBarInterrupt}
                step={0.01}
                value={progressVal}
                min={0}
                max={100}
                style={{ '--progress': `${progressVal}%` }}
            />
            <span className={Styles.time}>
                {convertSecondsToMinsSecs(parseInt(audioDuration))}
            </span>
        </div>
    );
};

export default ProgressBar;