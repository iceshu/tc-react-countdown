/**
 * Created by luqidong on 2017/3/21.
 */
import React, {PropTypes, Component} from 'react';
import {Countdown as Counttimer} from '../../utils/timer';
export  default class Countdown extends Component {

    constructor(props) {
        super(props);
        this._isMounted = true;
        this.state = {
            elem: <span> </span>
        };

    }

    componentDidMount() {
        const {time, fn, step, level}=this.props;
        this._isMounted && (this.countdown = new Counttimer(time, (data, isend)=> {
            this.setState({
                elem: fn(data, isend)
            });
        }, level, step));
        this._isMounted && this.countdown.start();
    }


    componentWillUnmount() {
        this._isMounted = false;
        this.countdown.stop()
    }

    componentWillReceiveProps(nextProps) {
        const {time}=nextProps;
        this.countdown.reset(time);
        this.countdown.start();
    }

    render() {
        return (
            <p>
                {this.state.elem || 'over'}
            </p>
        )
    }
}
