import * as React from 'react';
// import Modal from 'react-responsive-modal';
import './App.css';
// import MemeDetail from './components/MemeDetail';
// import MemeList from './components/MemeList';
import Game from './components/Game';

interface IState {
	currentMeme: any,
	memes: any[],
	next: any,
	uploadFileList: any,
	board: any[],
	victory: any
}

class App extends React.Component<{}, IState> {

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
		this.fetchMemes("")	
	}

	public render() {
		
		return (
		<div>
			<Game board={this.state.board} victory={this.state.victory} next={this.state.next}></Game> 
		</div>
		);
	}
	
	// Change selected meme
	private selectNewMeme(newMeme: any) {
		this.setState({
			currentMeme: newMeme
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
