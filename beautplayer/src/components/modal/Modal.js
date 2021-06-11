import { React, useState, useEffect } from 'react';

import './../../components/commonstyles.scss';
import Styles from './Modal.module.scss';

import XIcon from './../../assets/buttonsvg/x.svg';

const Modal = props => {
    const [buttons, setButtons] = useState();

    useEffect(() => {
        let _buttons = props.buttons.map((data, i) => {
            return <span
                className={`cursor-pointer`}
                onClick={() => {
                    data.function();
                    props.close();
                }}
                key={i}
            >
                {data.text}
            </span>;
        });
        setButtons(_buttons);
    }, [props.buttons]);

    return (
        <div className={Styles.modal}>
            <div className={`${Styles.box} acrylic`} style={props.acrylicColorStyle}>
                <div className={Styles.head}>
                    <span className={Styles.heading}>
                        {props.heading}
                    </span>
                    <span
                        className={Styles.close}
                        onClick={() => props.close()}
                    >
                        <img
                            alt={"Close"}
                            src={XIcon}
                            data-dark-mode-compatible
                        />
                    </span>
                </div>
                <div className={Styles.body}>
                    <p>
                        {props.body}
                    </p>
                </div>
                <div className={Styles.foot}>
                    {buttons}
                </div>
            </div>
        </div>
    );
};

export default Modal;