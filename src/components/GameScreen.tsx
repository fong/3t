import * as React from "react";
import Box from './Box';

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

interface IProps {
    screen: any,
    player: Player,
    game: Game,
    gameCallback: any
}

interface IState {
	next: any,
	board: any[],
    winner: any,
    color: any[],
    player1: any,
    player2: any
}

export default class GameScreen extends React.Component<IProps, IState> {

    interval: any;

    constructor(props: any) {
        super(props)   
        this.state = {
			next: 1,
			board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            winner: 0,
            color: [],
            player1: null,
            player2: null
		}     
        this.checkVictory = this.checkVictory.bind(this)
        this.toggle = this.toggle.bind(this)
        this.clear = this.clear.bind(this)
        this.leaveGame = this.leaveGame.bind(this)
        this.sync = this.sync.bind(this)
        
        this.sync();
        this.getPlayerInfos();
    }

    private getPlayerInfos() {
        let url1 = "https://3t-api.azurewebsites.net/api/players?playerID=" + this.props.game.player1;
        fetch(url1, {
            method: 'GET'
        })
        .then(res => {
            res.json().then(body => {
                this.setState({
                    player1: body
                });
            });
        });

        let url2 = "https://3t-api.azurewebsites.net/api/players?playerID=" + this.props.game.player2;
        fetch(url2, {
            method: 'GET'
        })
        .then(res => {
            res.json().then(body => {
                this.setState({
                    player2: body
                });
            });
        });
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
            winner: cv.v,
            color: cv.c
        })

        let p: any;

        if (this.props.player.playerID == this.props.game.player1.playerID){
            p = 1;
        } else {
            p = 2;
        }
        
        cv.c.forEach((e) => {
            const box = document.getElementById('box-' + e) as HTMLInputElement;
            if (cv.v == p) {
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
        let url = "https://3t-api.azurewebsites.net/api/games";

        this.props.game.winner = 4;

		fetch(url, {
            body: JSON.stringify(this.props.game),
            headers: {'cache-control': 'no-cache', 'Access-Control-Allow-Origin': '*', 'Accept': 'application/json',
            'Content-Type': 'application/json'},
            method: 'PUT'
        }).then(response => {
            if (!response.ok){
                alert("Unable to reset game");
            }
        });
        const boxes = document.getElementsByClassName('box') as HTMLCollectionOf<Element>;

        for (let i = 0; i < boxes.length; i++){
            boxes[i].className = 'box';
        }
    }
    
    private leaveGame() {
        clearInterval(this.interval);

        // if client is player in game (not spectator)
        if (this.props.game.player1 == this.props.player.playerID || this.props.game.player2 == this.props.player.playerID){
            let url = "https://3t-api.azurewebsites.net/api/games?gameID=" + this.props.game.gameID;
            fetch(url, {
                method: 'DELETE'
            });
        }
        this.props.gameCallback(null);
        this.props.screen('mainscreen');            
    }

    private sync() {
        this.interval = setInterval(() => {
            let url = "https://3t-api.azurewebsites.net/api/games?gameID=" + this.props.game.gameID;
            fetch(url, {
                method: 'GET'
            })
            .then(res => {
                if (res.ok){
                    res.json().then((body: Game) => {
                        if (body.gameID){
                            if (body.winner > 0){
                                this.getPlayerInfos();
                            }
                            this.setState({             // update game if new data received
                                next: body.turn,
                                board: body.board,
                                winner: body.winner
                            });
                            this.props.gameCallback(this.props.game);
                        } else {
                            clearInterval(this.interval);       // exit game if other player has exited game
                            this.props.gameCallback(null);
                            this.props.screen('mainscreen'); 
                        }
                    });
                } else {
                    clearInterval(this.interval);               // exit game if server returns error
                    this.props.gameCallback(null);
                    this.props.screen('mainscreen'); 
                }
            });
        }, 1000);
    }

	public render() {
        let status_text;
		if (this.state.winner == 1){
			status_text = 'Player 1 Wins!';
		} else if (this.state.winner == 2){
			status_text = 'Player 2 Wins!';
		} else if (this.state.winner == 3){
			status_text = 'Draw!'
		}
       
		return (
            <div style={{height: '100%'}}>
                <div className="header-wrapper">
                    <div className="header-left">
                        <button type="button" className="btn btn-outline-danger" onClick={() => this.leaveGame()}>
                            <i className="material-icons">exit_to_app</i>
                        </button>
                        <button type="button" className="btn btn-outline-dark">
                            <i className="material-icons">settings</i>
                        </button>
                    </div>
                    <div className="header-center">
                        <h3 className="roomcode">{this.props.game.gameID}</h3>
                    </div>
                    {/* <div className="header-right">
                        <div>1 watching</div>
                    </div> */}
			    </div>

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
                    <div className="grid-box noselect">
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
}