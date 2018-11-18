import * as React from 'react';
// import Modal from 'react-responsive-modal';
import './App.css';
// import MemeDetail from './components/MemeDetail';
// import MemeList from './components/MemeList';
import Box from './components/Box';

interface IState {
	currentMeme: any,
	memes: any[],
	next: any,
	uploadFileList: any,
	board: any[],
	victory: any
}

class App extends React.Component<{}, IState> {
	// win_conditions: any[] = [
	// 	[1, 0, 0, 1, 0, 0, 1, 0, 0], 
	// 	[0, 1, 0, 0, 1, 0, 0, 1, 0],
	// 	[0, 0, 1, 0, 0, 1, 0, 0, 1],
	// 	[1, 0, 0, 1, 0, 0, 1, 0, 0],
	// 	[0, 1, 0, 0, 1, 0, 0, 1, 0],
	// 	[0, 0, 1, 0, 0, 1, 0, 0, 1],
	// 	[1, 0, 0, 0, 1, 0, 0, 0, 1],
	// 	[0, 0, 1, 0, 1, 0, 1, 0, 0]
	// ]

	constructor(props: any) {
        super(props)
        this.state = {
			currentMeme: {"id":0, "title":"Loading ","url":"","tags":"⚆ _ ⚆","uploaded":"","width":"0","height":"0"},
			memes: [],
			next: 1,
			uploadFileList: null,
			board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
			victory: 0
		}     	
		this.selectNewMeme = this.selectNewMeme.bind(this)
		this.fetchMemes = this.fetchMemes.bind(this)
		this.toggle = this.toggle.bind(this)
		this.checkVictory = this.checkVictory.bind(this)
		this.clear = this.clear.bind(this)
		this.fetchMemes("")	
	}

	public render() {
		// const { open } = this.state;
		let status_text;
		if (this.state.victory === 1){
			status_text = 'Player 1 Wins!';
		} else if (this.state.victory === 2){
			status_text = 'Player 2 Wins!';
		} else if (this.state.victory === 3){
			status_text = 'Draw!'
		}

		return (
		<div>
			<div className="player player-one">
				<div>
					Name of Player 1
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
					Wins: 10
				</div>
			</div>
			<div className="grid-align">
				<div className="grid-box">
					<div className="grid-container">
						<div className="box" onClick={() => this.toggle(0)}>
							<Box boxID="0" board={this.state.board}></Box>
						</div>
						<div className="box" onClick={() => this.toggle(1)}>
							<Box boxID="1" board={this.state.board}></Box>
						</div>
						<div className="box" onClick={() => this.toggle(2)}>
							<Box boxID="2" board={this.state.board}></Box>
						</div> 
						<div className="box" onClick={() => this.toggle(3)}>
							<Box boxID="3" board={this.state.board}></Box>
						</div>
						<div className="box" onClick={() => this.toggle(4)}>
							<Box boxID="4" board={this.state.board}></Box>
						</div>
						<div className="box" onClick={() => this.toggle(5)}>
							<Box boxID="5" board={this.state.board}></Box>
						</div>
						<div className="box" onClick={() => this.toggle(6)}>
							<Box boxID="6" board={this.state.board}></Box>
						</div>
						<div className="box" onClick={() => this.toggle(7)}>
							<Box boxID="7" board={this.state.board}></Box>
						</div>
						<div className="box" onClick={() => this.toggle(8)}>
							<Box boxID="8" board={this.state.board}></Box>
						</div>
					</div>
				</div>
			</div>
			<div className='status_text_container'>
				<div>{status_text}</div>
				{ status_text ? (<button onClick={() => this.clear()}>Rematch</button>) : (<div></div>) }
			</div>
		</div>
		);
	}

	private clear() {
		this.setState({
			board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
			victory: 0
		})
	}
	
	// Change selected meme
	private selectNewMeme(newMeme: any) {
		this.setState({
			currentMeme: newMeme
		})
	}

	private toggle(boxID: number) {
		let v = this.checkVictory();
		if (!v && (this.state.board[boxID] == 0)){
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
		v = this.checkVictory();
		this.setState({
			victory: v,
		})
	}

	private checkVictory() {
		let b = this.state.board;
		for (let i = 0; i < 3; i++){
			//vertical
			if (b[i] + b[i+3] + b[i+6] == 3){
				return 1;
			} else if (b[i] + b[i+3] + b[i+6] == 12){
				return 2;
			}

			//horizontal
			if (b[0+i*3]+b[1+i*3]+b[2+i*3] == 3){
				return 1;
			} else if (b[0+i*3]+b[1+i*3]+b[2+i*3] == 12){
				return 2;
			}
		}

		//diagonal
		if ((b[0] + b[4] + b[8] == 3) || (b[2] + b[4] + b[6] == 3)){
			return 1;
		} else if ((b[0] + b[4] + b[8] == 12) || (b[2] + b[4] + b[6] == 12)){
			return 2;
		}

		let count = 0;
		for (let i = 0; i < b.length; i++){
			if (b[i] > 0){
				count++;
			}
		}

		if (count === 9){
			return 3;
		}

		return 0;
	}

	private fetchMemes(tag: any) {
		let url = "http://phase2apitest.azurewebsites.net/api/meme"
		if (tag !== "") {
			url += "/tag?=" + tag
		}
		fetch(url, {
			method: 'GET'
		})
		.then(res => res.json())
		.then(json => {
			let currentMeme = json[0]
			if (currentMeme === undefined) {
				currentMeme = {"id":0, "title":"No memes (╯°□°）╯︵ ┻━┻","url":"","tags":"try a different tag","uploaded":"","width":"0","height":"0"}
			}
			this.setState({
				currentMeme,
				memes: json
			})
		});
	}
}

export default App;
