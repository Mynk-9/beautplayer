import { React } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/navbar/Navbar';
import PlayerBar from '../../components/playerbar/PlayerBar';
import ColorModeSwitcher from '../../components/colormodeswitch/ColorModeSwitch';
import Styles from './SettingsPage.module.scss';

import PersistentStorage from './../persistentstorage';
import LeftIcon from './../../assets/buttonsvg/chevron-left.svg'

const AlbumPage = props => {
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
            <Navbar />
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
                                <td>Color Mode</td>
                                <td><ColorModeSwitcher /></td>
                            </tr>
                            <tr>
                                <td>Refresh Library</td>
                                <td>
                                    <button
                                        className={Styles.refreshLibraryButton}
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
                    <h2 className={Styles.credits}>Made with ❤ by Mayank.</h2>
                </div>
            </div>
            <PlayerBar />
        </>
    );
}

export default AlbumPage;