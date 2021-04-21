import { React, useEffect, useState, useContext, useRef } from 'react';
import Styles from './ProgressBar.module.scss';

import PlayerContext from './../playercontext';

const ProgressBar = props => {
    const { audioDuration, playPause } = useContext(PlayerContext);
    const [progressVal, setProgressVal] = useState(0);
    const [progressInterval, setProgressInterval] = useState();
    const progressBarRef = useRef();

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
        setProgressVal(0);
    }, [audioDuration]);

    useEffect(() => {
        if (playPause === 'play') {
            setProgressVal(
                parseInt(props.playerRef?.current?.currentTime)
            );
            setProgressInterval(
                setInterval(() => {
                    setProgressVal(
                        parseInt(props.playerRef?.current?.currentTime)
                    );
                }, 1000)
            );
        } else {
            clearInterval(progressInterval);
            setProgressVal(
                Math.round(props.playerRef?.current?.currentTime)
            );
        }
    }, [playPause, props.playerRef]);

    const handleProgressBarInterrupt = (e) => {
        const cursorPosX = parseInt(e.clientX);
        const progressBarRect = progressBarRef.current.getBoundingClientRect();
        let totalWidth = parseInt(progressBarRect.width);
        let offsetPosX = cursorPosX - parseInt(progressBarRect.x);
        const newTimeStamp = parseInt((offsetPosX / totalWidth) * audioDuration);

        setProgressVal(newTimeStamp);
        props.playerRef.current.currentTime = newTimeStamp;
    };

    return (
        <div className={Styles.progressBarContainer}>
            <span className={Styles.time}>
                {convertSecondsToMinsSecs(progressVal)}
            </span>
            <div
                className={Styles.progressBar}
                onMouseDown={handleProgressBarInterrupt}
                ref={progressBarRef}
            >
                <span
                    className={Styles.progressValue}
                    data-value={convertSecondsToMinsSecsWithSuffixes(progressVal)}
                    style={{ width: ((progressVal / audioDuration) * 100) + '%' }}
                />
            </div>
            <span className={Styles.time}>
                {convertSecondsToMinsSecs(parseInt(audioDuration))}
            </span>
        </div>
    );
};

export default ProgressBar;