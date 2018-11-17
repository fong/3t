import * as React from "react";
import x from '../../src/x.png';
import o from '../../src/o.png';

interface IProps {
    boxID: any,
    board: any[]
}

interface IState {
    // open: boolean
}

export default class Box extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            // open: false
        }
    }

	public render() {
        // const { open } = this.state;
        if (this.props.board[this.props.boxID] == 1) {
            return (
                <img src={o} width={'80%'}></img>	
            );
        }
        else if (this.props.board[this.props.boxID] == 2) {
            return (
                <img src={x} width={'80%'}></img>	
            );
        }
        else {
            return (
                <div></div>	
            );
        }
    }
}