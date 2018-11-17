import * as React from 'react';
// import Modal from 'react-responsive-modal';
import './App.css';
// import MemeDetail from './components/MemeDetail';
// import MemeList from './components/MemeList';
import Box from './components/Box';

interface IState {
	currentMeme: any,
	memes: any[],
	open: boolean,
	uploadFileList: any,
	board: any[],
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentMeme: {"id":0, "title":"Loading ","url":"","tags":"⚆ _ ⚆","uploaded":"","width":"0","height":"0"},
			memes: [],
			open: false,
			uploadFileList: null,
			board: [0, 0, 0, 1, 0, 0, 0, 2, 0]
		}     	
		this.selectNewMeme = this.selectNewMeme.bind(this)
		this.fetchMemes = this.fetchMemes.bind(this)
		this.toggle = this.toggle.bind(this)
		this.fetchMemes("")	
	}

	public render() {
		// const { open } = this.state;
		return (
		<div>
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
						<div className="box" onClick={() => this.toggle(9)}>
							<Box boxID="9" board={this.state.board}></Box>
						</div>
					</div>
				</div>
			</div>
		</div>
		);
	}
	
	// Change selected meme
	private selectNewMeme(newMeme: any) {
		this.setState({
			currentMeme: newMeme
		})
	}

	private toggle(boxID: number) {
		let temp = this.state.board;
		if (temp[boxID] == 0){
			temp[boxID] = 1;
		} else if (temp[boxID] == 1){
			temp[boxID] = 2;
		} else if (temp[boxID] == 2){
			temp[boxID] = 0;
		}
		this.setState({
			board: temp
		})
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
