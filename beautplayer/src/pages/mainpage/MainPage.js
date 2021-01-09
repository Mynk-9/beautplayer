import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import PlayerBar from './../../components/playerbar/PlayerBar';
import Styles from './MainPage.module.scss';

export default class MainPage extends React.Component {
    constructor() {
        super();
        this.state = { darkMode: '' };
    }

    setDarkMode = e => {
        if (e)
            this.setState({ darkMode: 'dark-mode' });
        else
            this.setState({ darkMode: '' });
    };

    render() {
        return (
            <div id="color-mode-setter" className={this.state.darkMode}>
                <Navbar />
                <div className={Styles.mainBody}>

                </div>
                <PlayerBar />
            </div>
        );
    }
}