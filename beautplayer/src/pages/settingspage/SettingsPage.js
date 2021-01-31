import { React } from 'react';
import { useHistory } from 'react-router-dom';
// import axios from 'axios';
import Navbar from '../../components/navbar/Navbar';
import PlayerBar from '../../components/playerbar/PlayerBar';
import ColorModeSwitcher from '../../components/colormodeswitch/ColorModeSwitch';
import Styles from './SettingsPage.module.scss';

import LeftIcon from './../../assets/buttonsvg/chevron-left.svg'

const AlbumPage = props => {
    let history = useHistory();

    // window.history.pushState(null, null, document.URL);
    // window.addEventListener('popstate', function () {
    //     window.history.pushState(null, null, document.URL);
    // });


    // api endpoint -- same domain, port 5000
    let API = window.location.origin;
    API = API.substring(0, API.lastIndexOf(':'));
    API += ':5000';

    let loadingText = 'Loading';

    let refreshLibrary = e => {
        console.log(e.target);

        let preventRedirect = () => window.history.pushState(null, null, document.URL);
        window.history.pushState(null, null, document.URL);
        window.addEventListener('popstate', preventRedirect);

        let loadingTextIteration = setInterval(() => {
            e.target.innerHTML = loadingText;
            switch (loadingText.length - 7) {
                case 0:
                case 1:
                case 2:
                    loadingText += '.';
                    break;
                case 3:
                    loadingText = 'Loading';
                    break;
            }
        }, 1000);
        // axios.post(API + '/refreshlibrary')
        //     .then(result => {
        //         setTimeout(() => {
        //             clearInterval(loadingTextIteration);
        //             e.target.innerHTML = 'Yet to be implemented';
        //         }, 5000);
        //     })
        //     .catch(err => {

        //     });
        setTimeout(() => {
            clearInterval(loadingTextIteration);
            window.removeEventListener('popstate', preventRedirect);
            window.history.back();
            e.target.innerHTML = 'Yet to be implemented';
        }, 10000);
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
                                        Yet to be implemented
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {/* <hr /> */}
                    <h2 className={Styles.credits}>Made with ❤ by Mayank.</h2>
                </div>
            </div>
            <PlayerBar />
        </>
    );
}

export default AlbumPage;