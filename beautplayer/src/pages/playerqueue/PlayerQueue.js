import { React, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import './../../components/commonstyles.scss';
import Styles from './PlayerQueue.module.scss';

import ThemeContext from './../../components/themecontext';

import LeftIcon from './../../assets/buttonsvg/chevron-left.svg';

const PlayerQueue = () => {
    const [acrylicColorStyle, setAcrylicColorStyle] = useState({});
    const [tableAcrylicColorStyle, setTableAcrylicColorStyle] = useState({});
    const { acrylicColor, letAcrylicTints } = useContext(ThemeContext);

    useEffect(() => {
        if (!letAcrylicTints) {
            setAcrylicColorStyle({});
            setTableAcrylicColorStyle({ '--acrylic-color': 'var(--non-transparent-acrylic-like-color)' });
        }
        else {
            if (acrylicColor && acrylicColor !== '--acrylic-color' && acrylicColor !== '') {
                setAcrylicColorStyle({ '--acrylic-color': acrylicColor });
                setTableAcrylicColorStyle({ '--acrylic-color': acrylicColor });
            }
            else {
                setAcrylicColorStyle({});
                setTableAcrylicColorStyle({ '--acrylic-color': 'var(--non-transparent-acrylic-like-color)' });
            }
        }
    }, [acrylicColor, letAcrylicTints]);

    let history = useHistory();

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
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                            <tr className={Styles.trackEntry}>
                                <td>Buttons</td>
                                <td>Buttons</td>
                                <td>Track</td>
                                <td>Album</td>
                                <td>Time</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default PlayerQueue;