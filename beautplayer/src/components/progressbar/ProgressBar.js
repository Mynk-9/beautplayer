import { React, useEffect, useState, useContext } from 'react';
import Styles from './ProgressBar.module.scss';

import PlayerContext from './../playercontext';

const ProgressBar = props => {
    const { audioDuration, playPause } = useContext(PlayerContext);
    const [progressVal, setProgressVal] = useState(0);
    const [progressInterval, setProgressInterval] = useState();
    const [currentProgress, setCurrentProgress] = useState('');

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
                    if (currentTime > 60)
                        setCurrentProgress(
                            parseInt(currentTime / 60).toString(10) + 'm '
                            + (currentTime % 60).toString(10) + 's'
                        );
                    else
                        setCurrentProgress(
                            currentTime.toString(10) + 's'
                        );
                    setProgressVal(currentTime);
                }, 1000)
            );
        } else {
            clearInterval(progressInterval);
        }
    }, [playPause]);

    return (
        <>
            <div className={Styles.progressBar}>
                <span
                    className={Styles.progressValue}
                    data-value={currentProgress}
                    style={{ width: ((progressVal / audioDuration) * 10) + 'em' }}
                />
            </div>
        </>
    );
};

export default ProgressBar;