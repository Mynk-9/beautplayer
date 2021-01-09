import React from 'react';
import Navbar from '../../components/navbar/Navbar';

export default class MainPage extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <>
                <Navbar />
            </>
        );
    }
}