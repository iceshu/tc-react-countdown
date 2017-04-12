/**
 * Created by luqidong on 2017/4/12.
 */
import React, {PropTypes, Component} from 'react';
import {Countdown as Counttimer} from '../lib/timer';
export  default class Countdown extends Component {

    constructor(props) {
        super(props);
        this._isMounted = true;
        this.state = {
            elem: <span> </span>
        };
        const {time, fn, step, level}=this.props;
        this.countdown = new Counttimer(time, (data, isend)=> {
            this.setState({
                elem: fn(data, isend)
            });
        }, level, step);
    }

    componentDidMount() {
        this._isMounted && this.countdown.start();
    }


    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        // const {endTime} = nextProps;
        // // if parent component update endTime, Countdown will change restTime too
        // if(formattimes(endTime) !== [0, 0, 0, 0] && this._isMounted) {
        //     const restTime = calculateTime(formattimes(endTime).getTime() - new Date().getTime());
        //     this.setState({restTime})
        // }
    }

    render() {
        return (
            <p>
                {this.state.elem || 'over'}
            </p>
        )
    }
}
