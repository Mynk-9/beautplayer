import { React, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ColorModeSwitcher from '../../components/colormodeswitch/ColorModeSwitch';
import './../../components/commonstyles.scss';
import Styles from './SettingsPage.module.scss';

import ThemeContext from './../../components/themecontext';

import PersistentStorage from './../persistentstorage';
import LeftIcon from './../../assets/buttonsvg/chevron-left.svg'

const AlbumPage = props => {
    const { letAcrylicTints, setLetAcrylicTints } = useContext(ThemeContext);

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
    }

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
                    <table>
                        <tbody>
                            <tr>
                                <td><b>Color Mode</b></td>
                                <td><ColorModeSwitcher /></td>
                            </tr>
                            <tr>
                                <td>
                                    <b>Enable Acrylic Color Tint</b><br />
                                    <i>The tint which top and bottom bars get according to current playing track</i>
                                </td>
                                <td>
                                    <button
                                        onClick={() => setLetAcrylicTints(!letAcrylicTints)}
                                        className={Styles.button}
                                    >
                                        {
                                            letAcrylicTints
                                                ? "Yes"
                                                : "No"
                                        }
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td><b>Refresh Library</b></td>
                                <td>
                                    <button
                                        className={Styles.button}
                                        onClick={refreshLibrary}
                                    >
                                        Refresh Media Library
                                    </button>
                                    <br />
                                    <br />
                                    <label></label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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

export default AlbumPage;