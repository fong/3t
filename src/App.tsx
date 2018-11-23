import * as React from 'react';
// import Modal from 'react-responsive-modal';
// import './App.css';
// import MemeDetail from './components/MemeDetail';
// import MemeList from './components/MemeList';
import GameScreen from './components/GameScreen';
import MainScreen from './components/MainScreen';
import ReactAI from 'react-appinsights';

interface IState {
	screen: any,
	player: Player,
	game: Game
}

// class Auth {
//     public playerID: any;
//     public playerName: string;
//     public passcode: string;
// }

class Player {
	public playerID: any = null;
	public playerName: any = null;
	public mmr: any = null;
	public wins: any = null;
	public games: any = null;
}

class Game {
    public gameID: any;
    public player1: any;
    public player2: any;
    public board: any;
    public watchers: any;
    public turn: any;
    public p1_timestamp: any;
    public p2_timestamp: any;
    public winner: any;
}

class App extends React.Component<{}, IState> {

	constructor(props: any) {
        super(props)
        this.state = {
			screen: 'mainscreen',
			player: new Player(),
			game: new Game()
		} 
	}

	screenCtrl = (d: any) => {
		this.setState({
			screen: d
		});
	}

	playerCallback = (d: Player) => {
		this.setState({
			player: d
		});
	}

	gameCallback = (d: Game) => {
		this.setState({
			game: d
		});
	}

	public render() {
		return (
		<div>
			{ this.state.screen === 'mainscreen' ? (
				<MainScreen screen={ this.screenCtrl } player={ this.state.player } playerCallback={this.playerCallback} gameCallback={this.gameCallback}></MainScreen>
				) : (<div></div>) }
			{ this.state.screen === 'game' ? (
				<GameScreen screen={ this.screenCtrl } player={this.state.player} game={this.state.game} gameCallback={this.gameCallback}></GameScreen>
				) : (<div></div>) }
		</div>
		);
	}
}

export default ReactAI.withTracking(App);
