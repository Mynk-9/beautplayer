import { React, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import TrackLiker from './../../components/trackliker/TrackLiker';
import TrackOptions from './../../components/trackoptions/TrackOptions';
import PlayButton from './../../components/playbutton/PlayButton';
import AddToPlaylistModal from '../../components/addtoplaylistmodal/AddToPlaylistModal';

import './../../components/commonstyles.scss';
import Styles from './PlayerQueue.module.scss';

import ThemeContext from './../../components/themecontext';
import PlayerContext from './../../components/playercontext';

import LeftIcon from './../../assets/buttonsvg/chevron-left.svg';
import MinusIcon from './../../assets/buttonsvg/minus.svg';
import PlusIcon from './../../assets/buttonsvg/plus.svg';

const PlayerQueue = () => {
    const [acrylicColorStyle, setAcrylicColorStyle] = useState({});
    const [tableAcrylicColorStyle, setTableAcrylicColorStyle] = useState({});
    const [trackList, setTrackList] = useState([]);
    const { acrylicColor, letAcrylicTints } = useContext(ThemeContext);
    const { playerQueue, setPlayerQueue } = useContext(PlayerContext);

    const [addToPlaylistModalVisible, setAddToPlaylistModalVisible] = useState(false);
    const [addToPlaylistModalTrackId, setAddToPlaylistModalTrackId] = useState(null);
    const [addToPlaylistModalTrackName, setAddToPlaylistModalTrackName] = useState(null);

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

    let buildQueue = () => {
        let key = 0;
        let _trackList = playerQueue.map((data) => {
            ++key;
            return (
                <tr key={key} className={Styles.trackEntry}>
                    <td>
                        <TrackOptions
                            options={[
                                {
                                    'component': <TrackLiker trackId={data.trackId} />,
                                    'text': 'Like',
                                },
                                {
                                    'component':
                                        <img
                                            src={PlusIcon}
                                            onClick={() => {
                                                setAddToPlaylistModalTrackId(data.trackId);
                                                setAddToPlaylistModalTrackName(data.track);
                                                setAddToPlaylistModalVisible(true);
                                            }}
                                            data-dark-mode-compatible
                                        />,
                                    'text': 'Add to Playlist',
                                },
                            ]}
                        />
                    </td>
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
                    <td>
                        <img
                            data-dark-mode-compatible
                            src={MinusIcon}
                            onClick={() => removeItem(data.trackId)}
                            alt={"Remove"}
                        />
                    </td>
                </tr>
            );
        });
        // oldest track would be at the bottom
        // playing tracks would advance from down
        // to top
        _trackList.reverse();

        setTrackList(_trackList);
    };

    let removeItem = (trackId) => {
        let queue = playerQueue;
        let i = 0;
        for (; i < playerQueue.length; ++i)
            if (trackId === queue[i].trackId)
                break;
        if (i >= playerQueue.length)
            return;
        queue.splice(i, 1);
        setPlayerQueue(queue);
        buildQueue();
    };

    useEffect(() => buildQueue(), []);

    return (
        <>
            {
                addToPlaylistModalVisible
                    ? <AddToPlaylistModal
                        trackId={addToPlaylistModalTrackId}
                        trackName={addToPlaylistModalTrackName}
                        close={() => setAddToPlaylistModalVisible(false)}
                        acrylicColorStyle={acrylicColorStyle}
                    />
                    : <></>
            }
            <div className={Styles.section} style={acrylicColorStyle} data-animate-gradient={letAcrylicTints}>
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