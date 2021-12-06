import { React, useState, useEffect } from 'react';

import './../../components/commonstyles.scss';
import Styles from './Modal.module.scss';

import XIcon from './../../assets/buttonsvg/x.svg';

const Modal = ({
    buttons: propButtons,
    acrylicColorStyle,
    heading,
    body,
    close,
}) => {
    const [buttons, setButtons] = useState();

    useEffect(() => {
        let _buttons = propButtons.map((data, i) => {
            return (
                <span
                    className={`cursor-pointer`}
                    onClick={() => {
                        data.function();
                        close();
                    }}
                    key={i}
                >
                    {data.text}
                </span>
            );
        });
        setButtons(_buttons);
    }, [propButtons, close]);

    return (
        <div className={Styles.modal}>
            <div className={`${Styles.box} acrylic`} style={acrylicColorStyle}>
                <div className={Styles.head}>
                    <span className={Styles.heading}>{heading}</span>
                    <span className={Styles.close} onClick={() => close()}>
                        <img
                            alt={'Close'}
                            src={XIcon}
                            data-dark-mode-compatible
                        />
                    </span>
                </div>
                <div className={Styles.body}>
                    <p>{body}</p>
                </div>
                <div className={Styles.foot}>{buttons}</div>
            </div>
        </div>
    );
};

export default Modal;
