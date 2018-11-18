import * as React from "react";
import Box from './Box';

interface IProps {
	next: any,
	board: any[],
	victory: any
} 

interface IState {
	next: any,
	board: any[],
    victory: any,
    color: any[],
    player: any
}

export default class Game extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
			next: 1,
			board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            victory: 0,
            color: [],
            player: 2
		}     
        this.checkVictory = this.checkVictory.bind(this)
        this.toggle = this.toggle.bind(this)
        this.clear = this.clear.bind(this)
    }

	public render() {
        let status_text;
		if (this.state.victory == 1){
			status_text = 'Player 1 Wins!';
		} else if (this.state.victory == 2){
			status_text = 'Player 2 Wins!';
		} else if (this.state.victory == 3){
			status_text = 'Draw!'
		}
       
		return (
            <div>
                <div className="player player-one">
                    <div>
                        Name of Player 1
                    </div>
                    <div>
                        MMR: 10
                    </div>
                    <div>
                        Wins: 5
                    </div>
                </div>
                <div className="player player-two">
                    <div>
                        Name of Player 2
                    </div>
                    <div>
                        MMR: 100
                    </div>
                    <div>
                        Wins: 10  
                    </div>
                </div>
                <div className="grid-align">
                    <div className="grid-box">
                        <div className="grid-container">
                            <div id='box-0' className="box" onClick={() => this.toggle(0)}>
                                <Box boxID="0" board={this.state.board}></Box>
                            </div>
                            <div id='box-1' className="box" onClick={() => this.toggle(1)}>
                                <Box boxID="1" board={this.state.board}></Box>
                            </div>
                            <div id='box-2' className="box" onClick={() => this.toggle(2)}>
                                <Box boxID="2" board={this.state.board}></Box>
                            </div> 
                            <div id='box-3' className="box" onClick={() => this.toggle(3)}>
                                <Box boxID="3" board={this.state.board}></Box>
                            </div>
                            <div id='box-4' className="box" onClick={() => this.toggle(4)}>
                                <Box boxID="4" board={this.state.board}></Box>
                            </div>
                            <div id='box-5' className="box" onClick={() => this.toggle(5)}>
                                <Box boxID="5" board={this.state.board}></Box>
                            </div>
                            <div id='box-6' className="box" onClick={() => this.toggle(6)}>
                                <Box boxID="6" board={this.state.board}></Box>
                            </div>
                            <div id='box-7' className="box" onClick={() => this.toggle(7)}>
                                <Box boxID="7" board={this.state.board}></Box>
                            </div>
                            <div id='box-8' className="box" onClick={() => this.toggle(8)}>
                                <Box boxID="8" board={this.state.board}></Box>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='status_text_container'>
                    <div>{status_text}</div>
                    { status_text ? (<button type="button" className="btn btn-outline-dark" onClick={() => this.clear()}>Rematch</button>) : (<div></div>) }
                </div>
            </div>
        );
    }

    private toggle(boxID: number) {
        let cv = this.checkVictory();
		if (!cv.v && (this.state.board[boxID] == 0)){
			let temp = this.state.board;
			let next = 0;
			if (this.state.next === 1){
				temp[boxID] = 1;
				next = 2;
			} else if (this.state.next === 2){
				temp[boxID] = 4;
				next = 1;
			}
			this.setState({
				board: temp,
				next: next
			})
		}
		cv = this.checkVictory();
		this.setState({
            victory: cv.v,
            color: cv.c
        })
        
        cv.c.forEach((e) => {
            const box = document.getElementById('box-' + e) as HTMLInputElement;
            if (cv.v == this.state.player) {
                box.className = 'box player-win'
            } else {
                box.className = 'box player-lose'
            }
        })
    }
    
    private checkVictory() {
		let b = this.state.board;
		for (let i = 0; i < 3; i++){
			//vertical
			if (b[i] + b[i+3] + b[i+6] == 3){
				return {v: 1, c: [i, i+3, i+6]};
			} else if (b[i] + b[i+3] + b[i+6] == 12){
				return {v: 2, c: [i, i+3, i+6]};
			}

			//horizontal
			if (b[0+i*3]+b[1+i*3]+b[2+i*3] == 3){
				return {v: 1, c: [0+i*3, 1+i*3, 2+i*3]};
			} else if (b[0+i*3]+b[1+i*3]+b[2+i*3] == 12){
				return {v: 2, c: [0+i*3, 1+i*3, 2+i*3]};
			}
		}

		//diagonal
		if ((b[0] + b[4] + b[8] == 3) || (b[2] + b[4] + b[6] == 3)){
			return {v: 1, c: (b[0] + b[4] + b[8] == 3) ? [0, 4, 8] : [2, 4, 6]};
		} else if ((b[0] + b[4] + b[8] == 12) || (b[2] + b[4] + b[6] == 12)){
			return {v: 2, c: (b[0] + b[4] + b[8] == 12) ? [0, 4, 8] : [2, 4, 6]};
		}

		let count = 0;
		for (let i = 0; i < b.length; i++){
			if (b[i] > 0){
				count++;
			}
		}

		if (count === 9){
			return {v: 3, c: []};
		}

		return {v: 0, c: []};
    }
    
    private clear() {
		this.setState({
			board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
			victory: 0
        })
        const boxes = document.getElementsByClassName('box') as HTMLCollectionOf<Element>;

        for (let i = 0; i < boxes.length; i++){
            boxes[i].className = 'box';
        }
	}
}