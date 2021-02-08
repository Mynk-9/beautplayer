import { React, useEffect, useState, useContext } from 'react';
import Styles from './ProgressBar.module.scss';

import PlayerContext from './../playercontext';

const ProgressBar = props => {
    const { audioDuration, playPause } = useContext(PlayerContext);
    const [progressVal, setProgressVal] = useState(0);
    const [progressInterval, setProgressInterval] = useState();
    const [currentProgress, setCurrentProgress] = useState('');

    const convertSecondsToMinsSecs = (secs) => {
        if (isNaN(secs))
            return '-/-';

        if (secs > 60)
            return (
                parseInt(secs / 60).toString(10) + ':'
                + (secs % 60).toString(10)
            );
        else
            return (
                '0:' + secs.toString(10)
            );
    };
    const convertSecondsToMinsSecsWithSuffixes = (secs) => {
        if (secs > 60)
            return (
                parseInt(secs / 60).toString(10) + 'm '
                + (secs % 60).toString(10) + 's'
            );
        else
            return (
                secs.toString(10) + 's'
            );
    };

    useEffect(() => {
        setProgressVal(props.currentTime);
    }, [props.currentTime]);

    useEffect(() => {
        setProgressVal(0);
    }, [audioDuration]);

    useEffect(() => {
        if (playPause === 'play') {
            setProgressInterval(
                setInterval(() => {
                    const currentTime = parseInt(props.playerRef.current.currentTime);
                    setProgressVal(currentTime);
                }, 1000)
            );
        } else {
            clearInterval(progressInterval);
        }
    }, [playPause]);

    return (
        <>
            <span className={Styles.time}>
                {convertSecondsToMinsSecs(progressVal)}
            </span>
            <div className={Styles.progressBar}>
                <span
                    className={Styles.progressValue}
                    data-value={convertSecondsToMinsSecsWithSuffixes(progressVal)}
                    style={{ width: ((progressVal / audioDuration) * 100) + '%' }}
                />
            </div>
            <span className={Styles.time}>
                {convertSecondsToMinsSecs(parseInt(audioDuration))}
            </span>
        </>
    );
};

export default ProgressBar;