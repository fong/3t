import * as React from 'react';
// import Modal from 'react-responsive-modal';
import './App.css';
// import MemeDetail from './components/MemeDetail';
// import MemeList from './components/MemeList';
import Game from './components/Game';
import MainScreen from './components/MainScreen';

interface IState {
	screen: any,
	username: string
}

class App extends React.Component<{}, IState> {

	constructor(props: any) {
        super(props)
        this.state = {
			screen: 'mainscreen',
			username: "",
		}     	
		this.fetchMemes = this.fetchMemes.bind(this)
		this.fetchMemes("")	
	}

	screenCtrl = (d: any) => {
		this.setState({
			screen: d
		});
	}

	usernameCallback = (d: any) => {
		this.setState({
			username: d
		});
	}

	public render() {
		return (
		<div>
			{ this.state.screen === 'mainscreen' ? (<MainScreen screen={ this.screenCtrl } username={ this.state.username } usernameCallback={this.usernameCallback}></MainScreen>) : (<div></div>) }
			{ this.state.screen === 'game' ? (<Game screen={ this.screenCtrl }></Game>) : (<div></div>) }
		</div>
		);
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
		});
	}
}

export default App;
