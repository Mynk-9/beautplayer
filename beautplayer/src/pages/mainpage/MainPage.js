import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import PlayerBar from './../../components/playerbar/PlayerBar';
import Styles from './MainPage.module.scss';

export default class MainPage extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <>
                <Navbar />
                <div className={Styles.mainBody}>

                </div>
                <PlayerBar />
            </>
        );
    }
}