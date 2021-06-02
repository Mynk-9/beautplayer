import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ColorModeSwitcher from '../../components/colormodeswitch/ColorModeSwitch';

import AccordionSection from '../../components/accordionsection/AccordionSection';
import Switcher from '../../components/switcher/Switcher';

import './../../components/commonstyles.scss';
import Styles from './SettingsPage.module.scss';

import ThemeContext from './../../components/themecontext';
import PlayerContext from '../../components/playercontext';
import PersistentStorage from './../persistentstorage';

import LeftIcon from './../../assets/buttonsvg/chevron-left.svg';
import PlusIcon from './../../assets/buttonsvg/plus.svg';
import MinusIcon from './../../assets/buttonsvg/minus.svg';

const SettingsPage = props => {
    const { letAcrylicTints, setLetAcrylicTints } = useContext(ThemeContext);
    const {
        crossfadeEnable, setCrossfadeEnable,
        crossfadePlaylist, setCrossfadePlaylist,
        crossfadeNextPrev, setCrossfadeNextPrev,
        crossfadeDuration, setCrossfadeDuration,
        playPauseFadeEnable, setPlayPauseFadeEnable,
    } = useContext(PlayerContext);
    // const crossfadeDurationComponentRef = useRef(null);

    let history = useHistory();

    // api endpoint -- same domain, port 5000
    let API = window.location.origin;
    API = API.substring(0, API.lastIndexOf(':'));
    API += ':5000';

    let loadingText = 'Working';

    let refreshLibrary = e => {
        let messageLabel = e.target.parentNode.querySelector('label');
        messageLabel.innerHTML = "Don't press back button or redirect the page!";

        // to prevent the browser back button while library is being refreshed.
        let preventRedirect = () => window.history.pushState(null, null, document.URL);
        window.history.pushState(null, null, document.URL);
        window.addEventListener('popstate', preventRedirect);

        // working... text on button
        let loadingTextIteration = setInterval(() => {
            e.target.innerHTML = loadingText;
            switch (loadingText.length - 7) {
                case 0:
                case 1:
                case 2:
                    loadingText += '.';
                    break;
                case 3:
                    loadingText = 'Working';
                    break;
                default:
                    loadingText = 'Working';
            }
        }, 1000);

        // post request to refresh library
        axios.post(API + '/refreshlibrary')
            .then(result => {
                localStorage.clear();
                PersistentStorage.MainPageAllAlbumCards = [];

                window.removeEventListener('popstate', preventRedirect);
                window.history.back();
                clearInterval(loadingTextIteration);
                e.target.innerHTML = 'Refresh Media Library';

                messageLabel.innerHTML = 'Done :)'
            })
            .catch(err => {
                localStorage.clear();
                PersistentStorage.MainPageAllAlbumCards = [];

                window.removeEventListener('popstate', preventRedirect);
                window.history.back();
                clearInterval(loadingTextIteration);
                e.target.innerHTML = 'Refresh Media Library';

                messageLabel.innerHTML = 'Error :(';
            });
    };

    return (
        <>
            <div className={Styles.section}>
                <div className={Styles.header}>
                    <img data-dark-mode-compatible
                        alt="Go Back"
                        className={Styles.back}
                        src={LeftIcon}
                        onClick={() => history.goBack()}
                    />
                    <h1 className={Styles.heading}>Settings</h1>
                </div>
                <div className={Styles.content}>
                    <AccordionSection
                        title="General Settings"
                        opened={true}
                        options={[
                            {
                                'option': 'Color Mode',
                                'component': <ColorModeSwitcher />,
                            },
                            {
                                'option': 'Enable Acrylic Color Tint',
                                'brief': 'The tint which top and bottom bars get according to current playing track',
                                'component':
                                    <Switcher
                                        state={letAcrylicTints}
                                        onChange={(state) => {
                                            setLetAcrylicTints(state);
                                        }}
                                    />
                            },
                            {
                                'option': 'Refresh Library',
                                'component':
                                    <button
                                        className={Styles.button}
                                        onClick={refreshLibrary}
                                    >
                                        {'Refresh Media Library'}
                                    </button>,
                            },
                        ]}
                    />
                    <AccordionSection
                        title="Experimental Settings"
                        options={[
                            {
                                'option': 'Track fade on play/pause',
                                'component':
                                    <Switcher
                                        state={playPauseFadeEnable}
                                        onChange={(state) => {
                                            setPlayPauseFadeEnable(state);
                                        }}
                                    />,
                            },
                            {
                                'option': 'Crossfade',
                                'brief': 'Make a track be heard gradually as another becomes silent',
                                'component':
                                    <Switcher
                                        state={crossfadeEnable}
                                        onChange={(state) => {
                                            setCrossfadeEnable(state);
                                        }}
                                    />,
                            },
                            {
                                'option': 'Crossfade for Playlist',
                                'component':
                                    <Switcher
                                        state={crossfadePlaylist}
                                        onChange={(state) => {
                                            setCrossfadePlaylist(state);
                                        }}
                                        enabled={crossfadeEnable}
                                    />,
                            },
                            {
                                'option': 'Crossfade when pressed Next/Prev',
                                'component':
                                    <Switcher
                                        state={crossfadeNextPrev}
                                        onChange={(state) => {
                                            setCrossfadeNextPrev(state);
                                        }}
                                        enabled={crossfadeEnable}
                                    />,
                            },
                            {
                                'option': 'Set Crossfade/Fade Duration',
                                'component':
                                    <>
                                        <button
                                            onClick={() => {
                                                if (crossfadeDuration === 0)
                                                    return;
                                                setCrossfadeDuration(crossfadeDuration - 1);
                                            }}
                                            className={Styles.button}
                                            disabled={!crossfadeEnable}
                                            style={{
                                                marginRight: '1rem',
                                                borderRadius: '50%',
                                                padding: 0,
                                            }}
                                        >
                                            <img
                                                src={MinusIcon}
                                                style={{ verticalAlign: 'middle' }}
                                                data-dark-mode-compatible
                                            />
                                        </button>
                                        {`${crossfadeDuration} sec`}
                                        <button
                                            onClick={() => {
                                                if (crossfadeDuration === 10)
                                                    return;
                                                setCrossfadeDuration(crossfadeDuration + 1);
                                            }}
                                            className={Styles.button}
                                            disabled={!crossfadeEnable}
                                            style={{
                                                marginLeft: '1rem',
                                                borderRadius: '50%',
                                                padding: 0,
                                            }}
                                        >
                                            <img
                                                src={PlusIcon}
                                                style={{ verticalAlign: 'middle' }}
                                                data-dark-mode-compatible
                                            />
                                        </button>
                                    </>,
                            },
                        ]}
                    />
                    <hr />
                    <p className={Styles.credits}>
                        Made with ❤ by Mayank.<br />
                        See the source <a href="https://github.com/Mynk-9/beautplayer">here</a>.
                    </p>
                </div>
            </div>
        </>
    );
}

export default SettingsPage;