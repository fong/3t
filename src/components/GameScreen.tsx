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
	turn: any,
	board: any[],
    winner: any,
    color: any[],
    player1: any,
    player2: any,
    p: any,
    mutex: boolean,
}

export default class GameScreen extends React.Component<IProps, IState> {

    interval: any;

    constructor(props: any) {
        super(props)   
        this.state = {
			turn: 0,
			board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            winner: 0,
            color: [],
            player1: null,
            player2: null,
            p: null,
            mutex: false
        }     
        this.checkVictory = this.checkVictory.bind(this)
        this.toggle = this.toggle.bind(this)
        this.clear = this.clear.bind(this)
        this.leaveGame = this.leaveGame.bind(this)
    }

    componentWillMount(){
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
    
    private async toggle(boxID: number) {
        let m = await this.state.mutex;
        let t = await this.state.turn;

        if (this.state.p == 1 || this.state.p == 2){

            if (m == false && t == this.state.p){
                await this.setState({mutex: true, turn: 10});

                let temp_board = this.state.board;

                if ((this.state.winner == 0 || this.state.winner == 4) && (this.state.board[boxID] == 0)){
                    if ((t == 1) && this.state.p === 1){
                        temp_board[boxID] = 1;
                        t = 2;
                    } else if ((t == 2) && this.state.p === 2){
                        temp_board[boxID] = 4;
                        t = 1;
                    }

                    let cv = this.checkVictory(temp_board);
        
                    let url = "https://3t-api.azurewebsites.net/api/games";
            
                    let t_body = this.props.game;
                    t_body.board = JSON.stringify(temp_board);
                    t_body.turn = t;  
                    t_body.winner = cv.v;
                    
                    console.log(t_body);

                    fetch(url, {
                        body: JSON.stringify(t_body),
                        headers: {'cache-control': 'no-cache', 'Access-Control-Allow-Origin': '*', 'Accept': 'application/json',
                        'Content-Type': 'application/json'},
                        method: 'PUT'
                    });

                    await this.setState({
                        mutex: false
                    });
                }
            }
        }
    }
    
    private checkVictory(b: any) {
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
        const boxes = document.getElementsByClassName('box') as HTMLCollectionOf<Element>;

        for (let i = 0; i < boxes.length; i++){
            boxes[i].className = 'box';
        }

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
        this.interval = setInterval(async () => {
            let m = await this.state.mutex
            if (m == false){
                let url = "https://3t-api.azurewebsites.net/api/games?gameID=" + this.props.game.gameID;
                fetch(url, {
                    headers: {'cache-control': 'no-cache', 'Access-Control-Allow-Origin': '*'},
                    method: 'GET'
                })
                .then(res => {
                    if (res.ok){
                        res.json().then((body: any) => {
                            console.log(body.turn);
                            if (body.gameID == null){
                                clearInterval(this.interval);       // exit game if other player has exited game
                                this.props.gameCallback(new Game());
                                this.props.screen('mainscreen'); 
                            } else {
                                if (body.board == "[0,0,0,0,0,0,0,0,0]"){
                                    const boxes = document.getElementsByClassName('box') as HTMLCollectionOf<Element>;
                                    for (let i = 0; i < boxes.length; i++){
                                        boxes[i].className = 'box';
                                    }
                                }
                                
                                if (body.winner > 0) {
                                    this.getPlayerInfos();
                                };

                                let temp_p;
                                
                                if (this.props.player.playerID == this.state.player1.playerID){
                                    temp_p = 1
                                } else if (this.props.player.playerID == this.state.player2.playerID){
                                    temp_p = 2
                                } else {
                                    temp_p = 0
                                }
                                let cv = this.checkVictory(JSON.parse(body.board));
                                
                                cv.c.forEach((e) => {
                                    const box = document.getElementById('box-' + e) as HTMLInputElement;
                                    if (cv.v == this.state.p || this.state.p == 0) {
                                        box.className = 'box player-win'
                                    } else {
                                        box.className = 'box player-lose'
                                    }
                                })
                                
                                if (body.turn == temp_p){
                                    this.setState({             // update game if new data received
                                        turn: body.turn,
                                        board: JSON.parse(body.board),
                                        winner: cv.v,
                                        p: temp_p,
                                        color: cv.c
                                    });
                                }
                                this.props.gameCallback(body);
                            }
                        });
                    } else {
                        clearInterval(this.interval);               // exit game if server returns error
                        this.props.gameCallback(null);
                        this.props.screen('mainscreen'); 
                    }
                });
            }
        }, 2000);
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
                    {this.state.player1 != null ? (
                        <div>
                            <div>
                                {this.state.player1.playerName}
                            </div>
                            <div>
                                MMR: {this.state.player1.mmr}
                            </div>
                            <div>
                                Wins: {this.state.player1.wins}
                            </div>
                        </div>) :(<div></div>)
                    }
                </div>
                <div className="player player-two">
                    {this.state.player2 != null ? (
                        <div>
                            <div>
                                {this.state.player2.playerName}
                            </div>
                            <div>
                                MMR: {this.state.player2.mmr}
                            </div>
                            <div>
                                Wins: {this.state.player2.wins}
                            </div>
                        </div>) :(<div></div>)
                    }
                </div>
                <div className="grid-align">
                    <div className="grid-box noselect">
                        <div className="grid-container">
                            <div id='box-0' className="box" onClick={async () => await this.toggle(0)}>
                                <Box boxID="0" board={this.state.board}></Box>
                            </div>
                            <div id='box-1' className="box" onClick={async () => await this.toggle(1)}>
                                <Box boxID="1" board={this.state.board}></Box>
                            </div>
                            <div id='box-2' className="box" onClick={async () => await this.toggle(2)}>
                                <Box boxID="2" board={this.state.board}></Box>
                            </div> 
                            <div id='box-3' className="box" onClick={async () => await this.toggle(3)}>
                                <Box boxID="3" board={this.state.board}></Box>
                            </div>
                            <div id='box-4' className="box" onClick={async () => await this.toggle(4)}>
                                <Box boxID="4" board={this.state.board}></Box>
                            </div>
                            <div id='box-5' className="box" onClick={async () => await this.toggle(5)}>
                                <Box boxID="5" board={this.state.board}></Box>
                            </div>
                            <div id='box-6' className="box" onClick={async () => await this.toggle(6)}>
                                <Box boxID="6" board={this.state.board}></Box>
                            </div>
                            <div id='box-7' className="box" onClick={async () => await this.toggle(7)}>
                                <Box boxID="7" board={this.state.board}></Box>
                            </div>
                            <div id='box-8' className="box" onClick={async () => await this.toggle(8)}>
                                <Box boxID="8" board={this.state.board}></Box>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    { this.state.turn == 1 ? ( <div>{this.state.player1.playerName}'s turn</div>) : (<div></div>) }
                    { this.state.turn == 2 ? ( <div>{this.state.player2.playerName}'s turn</div>) : (<div></div>) }
                </div>
                <div className='status_text_container'>
                    <div>{status_text}</div>
                    { status_text ? (<button type="button" className="btn btn-outline-dark" onClick={() => this.clear()}>Rematch</button>) : (<div></div>) }
                </div>
            </div>
        );
    }
}