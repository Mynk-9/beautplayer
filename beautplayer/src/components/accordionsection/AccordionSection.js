import React, { useState, useEffect, useContext, useRef } from 'react';
import './../commonstyles.scss';
import Styles from './AccordionSection.module.scss';

import ThemeContext from './../themecontext';

import TriangleIcon from './../../assets/buttonsvg/triangle.svg';

const AccordionSection = ({ title, options, opened }) => {
    const { letAcrylicTints, acrylicColor } = useContext(ThemeContext);
    const [acrylicColorStyle, setAcrylicColorStyle] = useState({});
    const [open, setOpen] = useState(opened === true);
    const [tableHeight, setTableHeight] = useState({});
    const tableRef = useRef(null);

    useEffect(() => {
        if (tableRef) {
            setTableHeight({
                '--table-height': `${tableRef.current.scrollHeight}px`,
            });
        }
    }, [setTableHeight, options]);

    useEffect(() => {
        if (!letAcrylicTints) {
            setAcrylicColorStyle({ '--acrylic-color': 'var(--non-transparent-acrylic-like-color)' });
        }
        else {
            if (acrylicColor && acrylicColor !== '--acrylic-color' && acrylicColor !== '') {
                setAcrylicColorStyle({ '--acrylic-color': String(acrylicColor.slice(0, acrylicColor.length - 6) + ', 0.6)') });
            }
            else {
                setAcrylicColorStyle({ '--acrylic-color': 'var(--non-transparent-acrylic-like-color)' });
            }
        }
    }, [acrylicColor, letAcrylicTints]);

    return (
        <div className={Styles.details} style={acrylicColorStyle} data-open={open}>
            <div className={Styles.summary} onClick={() => setOpen(!open)}>
                <span>
                    <img src={TriangleIcon} alt={''} data-dark-mode-compatible />
                </span>
                <span>{title}</span>
            </div>
            <div className={Styles.p} style={tableHeight}>
                <table ref={tableRef}>
                    <tbody>
                        {
                            options.map(({ option, brief, component }) => {
                                return (
                                    <tr key={option}>
                                        <td>
                                            <b>{option}</b>
                                            {
                                                brief
                                                    ? <><br /><i>{brief}</i></>
                                                    : <></>
                                            }
                                        </td>
                                        <td>
                                            {component}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccordionSection;