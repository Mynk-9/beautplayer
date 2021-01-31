import { React } from 'react';
import { useHistory } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import PlayerBar from '../../components/playerbar/PlayerBar';
import ColorModeSwitcher from '../../components/colormodeswitch/ColorModeSwitch';
import Styles from './SettingsPage.module.scss';

import LeftIcon from './../../assets/buttonsvg/chevron-left.svg'

const AlbumPage = props => {
    let history = useHistory();

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
                                <td><button>Yet to be implemented</button></td>
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