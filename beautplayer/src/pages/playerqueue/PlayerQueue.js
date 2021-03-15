import { React, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import TrackLiker from './../../components/trackliker/TrackLiker';
import PlayButton from './../../components/playbutton/PlayButton';

import './../../components/commonstyles.scss';
import Styles from './PlayerQueue.module.scss';

import ThemeContext from './../../components/themecontext';
import PlayerContext from './../../components/playercontext';

import LeftIcon from './../../assets/buttonsvg/chevron-left.svg';

const PlayerQueue = () => {
    const [acrylicColorStyle, setAcrylicColorStyle] = useState({});
    const [tableAcrylicColorStyle, setTableAcrylicColorStyle] = useState({});
    const { acrylicColor, letAcrylicTints } = useContext(ThemeContext);
    const { playerQueue } = useContext(PlayerContext);

    useEffect(() => {
        if (!letAcrylicTints) {
            setAcrylicColorStyle({});
            setTableAcrylicColorStyle({ '--acrylic-color': 'var(--non-transparent-acrylic-like-color)' });
        }
        else {
            if (acrylicColor && acrylicColor !== '--acrylic-color' && acrylicColor !== '') {
                setAcrylicColorStyle({ '--acrylic-color': acrylicColor });
                setTableAcrylicColorStyle({ '--acrylic-color': String(acrylicColor.slice(0, acrylicColor.length - 6) + ', 0.3)') });
            }
            else {
                setAcrylicColorStyle({});
                setTableAcrylicColorStyle({ '--acrylic-color': 'var(--non-transparent-acrylic-like-color)' });
            }
        }
    }, [acrylicColor, letAcrylicTints]);

    let history = useHistory();

    let key = 0;
    let trackList = playerQueue.map((data) => {
        ++key;
        return (
            <tr key={key} className={Styles.trackEntry}>
                <td><TrackLiker trackId={data.trackId} /></td>
                <td>
                    <PlayButton
                        audioSrc={data.audioSrc}
                        audioDuration={data.audioDuration}
                        track={data.track}
                        albumArt={data.albumArt}
                        albumTitle={data.albumTitle}
                        albumArtist={data.albumArtist}
                        isPlaylist={data.isPlaylist}
                        playlistTitle={data.playlistTitle}
                        addToQueue={() => { }}  // already in the queue
                    />
                </td>
                <td>{data.track}</td>
                <td>{data.albumArtist}</td>
                <td>{data.audioDuration}</td>
            </tr>
        );
    });
    // oldest track would be at the bottom
    // playing tracks would advance from down
    // to top
    trackList.reverse();

    return (
        <>
            <div className={Styles.section} style={acrylicColorStyle}>
                <div className={Styles.header}>
                    <img data-dark-mode-compatible
                        alt="Go Back"
                        className={Styles.back}
                        src={LeftIcon}
                        onClick={() => history.goBack()}
                    />
                    <h1 className={Styles.heading}>Queue</h1>
                </div>
                <div className={Styles.content}>
                    <table
                        className={Styles.trackList}
                        style={tableAcrylicColorStyle}
                    >
                        <tbody>
                            {trackList}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default PlayerQueue;