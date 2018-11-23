import * as React from "react";
import x from '../../src/x.png';
import o from '../../src/o.png';
import ReactAI from 'react-appinsights';

class Auth {
    public playerID: any;
    public playerName: string;
    public passcode: string;
}

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
    playerCallback: any
    gameCallback: any
}

interface IState {
    // open: boolean
    player: Player,
    create: any,
    join: any,
    login_text: any,
    liveGames: any,
    leaderboard: any
}

class MainScreen extends React.Component<IProps, IState> {

    interval1: any;
    interval2: any;

    constructor(props: any) {
        super(props) 

        this.state = {
            player: this.props.player,
            create: null,
            join: false,
            login_text: "",
            liveGames: null,
            leaderboard: null
        }
        
        this.joinToggle = this.joinToggle.bind(this)
        this.login = this.login.bind(this)
        this.getMyPlayerInfo = this.getMyPlayerInfo.bind(this)
        this.fetchLiveData = this.fetchLiveData.bind(this)
    }

    componentWillMount(){
        let url_games = "https://3t-api.azurewebsites.net/api/games";
        fetch(url_games, {
            method: 'GET'
        })
        .then(res => {
            res.json().then(body => {
               this.setState({
                   liveGames: body
               })
            });
        });

        let url_leaderboards = "https://3t-api.azurewebsites.net/api/players/top?mode=mmr";
        fetch(url_leaderboards, {
            method: 'GET'
        })
        .then(res => {
            res.json().then(body => {
               this.setState({
                   leaderboard: body
               })
            });
        });

        this.fetchLiveData();
    }

    componentWillUnmount() {
        clearInterval(this.interval1);
        clearInterval(this.interval2);
    }

    private joinToggle() {
        if (this.state.create){
            this.deleteGame();
        }
        this.setState({join: !this.state.join});
    }

    private login() {
        const playerName = (document.getElementById("playername") as HTMLInputElement).value;
        const passcode = (document.getElementById("passcode") as HTMLInputElement).value;
    
        if (playerName === null || passcode === null) {
            return;
        }
    
        const url = "https://3t-api.azurewebsites.net/api/auths"
    
        const auth = new Auth();
        auth.playerID = null;
        auth.playerName = playerName;
        auth.passcode = passcode;
    
        fetch(url, {
            body: JSON.stringify(auth),
            headers: {'cache-control': 'no-cache', 'Access-Control-Allow-Origin': '*', 'Accept': 'application/json',
            'Content-Type': 'application/json'},
            method: 'POST'
        }).then(response => {
            response.json().then(body => {
                if (response.status === 200) {
                    if (body["passcode"] == null){
                        this.setState({
                            login_text: "Password Incorrect (Account Exists)"
                        });
                    } else if (body["playerID"] != null){
                        this.getMyPlayerInfo(body["playerID"]);
                    }
                } else {
                    alert(response.statusText);
                }
            })
        })
    }

    private getMyPlayerInfo(playerID: string) {
        let url = "https://3t-api.azurewebsites.net/api/players?playerID=" + playerID;
        fetch(url, {
            method: 'GET'
        })
        .then(res => {
            res.json().then(body => {
                this.setState({
                    player: body
                });
                this.props.playerCallback(body);
            });
        });
    }

    private createGame(): boolean{
        this.setState({
            join: false
        })

        let url = "https://3t-api.azurewebsites.net/api/games";

        let game = new Game();

        game.gameID = generateRoomID();
        game.player1 = this.state.player.playerID;
        game.p1_timestamp = Date.now();

        fetch(url, {
            body: JSON.stringify(game),
            headers: {'cache-control': 'no-cache', 'Access-Control-Allow-Origin': '*', 'Accept': 'application/json',
            'Content-Type': 'application/json'},
            method: 'POST'
        }).then(response => {
            response.json().then(body => {
                if (response.status === 200) {
                    if (body["player1"] != this.state.player.playerID){
                        return this.createGame();
                    } else {
                        this.startGameCheck();
                        this.setState({
                            create: body["gameID"]
                        })
                        this.props.gameCallback({
                            game: body
                        })
                        return true;
                    }
                } else {
                    alert(response.statusText);
                    return true;
                }
            })
            return true;
        })
        return true;
    }

    private startGameCheck() {
        this.interval1 = setInterval(() => {
            let url = "https://3t-api.azurewebsites.net/api/games?gameID=" + this.state.create;
            fetch(url, {
                method: 'GET'
            })
            .then(res => {
                res.json().then(body => {
                    if (body["player2"] != null) {
                        clearInterval(this.interval1);
                        this.props.gameCallback(body);
                        this.props.screen('game');
                    }
                });
            });
        }, 1000);
    }

    private enterGame(){
        const room = (document.getElementById("enter-room") as HTMLInputElement).value;

        let url = "https://3t-api.azurewebsites.net/api/games?gameID=" + room;
        fetch(url, {
            method: 'GET'
        })
        .then(res => {
            res.json().then(body => {
                if (body["gameID"] == null){
                    alert("Game Code Invalid. " + room + "is not an active room.");
                } else {
                    let temp = body;
                    if (body["player2"] == null){
                        temp["player2"] = this.state.player.playerID;
                        temp["p2_timestamp"] = Date.now();

                        fetch(url, {
                            body: JSON.stringify(temp),
                            headers: {'cache-control': 'no-cache', 'Access-Control-Allow-Origin': '*', 'Accept': 'application/json',
                            'Content-Type': 'application/json'},
                            method: 'PUT'
                        }).then(response => {
                            if (!response.ok){
                                alert("Room Valid, unable to enter room");
                            } else {
                                this.props.gameCallback(temp);
                                this.props.screen('game');   
                            }
                        });
                    } else {
                        this.props.gameCallback(temp);
                        this.props.screen('game');   
                    }
                }
            });
        });
    }

    private deleteGame(){
        clearInterval(this.interval1);
        let url = "https://3t-api.azurewebsites.net/api/games?gameID=" + this.state.create;
        fetch(url, {
            method: 'DELETE'
        })
        .then(res => {
            if (res.ok){
                this.setState({
                    create: null
                });
                this.props.gameCallback(null);
            }
        });
    }

    private fetchLiveData(){
        this.interval2 = setInterval(() => {
            let url_games = "https://3t-api.azurewebsites.net/api/games";
            fetch(url_games, {
                method: 'GET'
            })
            .then(res => {
                res.json().then(body => {
                   this.setState({
                       liveGames: body
                   })
                });
            });

            let url_leaderboards = "https://3t-api.azurewebsites.net/api/players/top?mode=mmr";
            fetch(url_leaderboards, {
                method: 'GET'
            })
            .then(res => {
                res.json().then(body => {
                   this.setState({
                       leaderboard: body
                   })
                });
            });
        }, 5000);
    }

	public render() {
        // const { open } = this.state
        let lg: any = [];
        let lb: any = [];

        if (Array.isArray(this.state.liveGames)) {
            for (let i = 0; i < this.state.liveGames.length; i++){
            lg.push(
                <tr key={i}>
                    <th scope="row" className="noselect">{this.state.liveGames[i].gameID}</th>
                    <td className="noselect">{this.state.liveGames[i].player1}</td>
                    <td className="noselect">{this.state.liveGames[i].player2}</td>
                </tr>
            );
            }
        }

        if (Array.isArray(this.state.leaderboard)) {
            for (let i = 0; i < this.state.leaderboard.length; i++){
            lb.push(
                <tr key={i}>
                    <th scope="row" className="noselect">{i+1}</th>
                    <th className="noselect">{this.state.leaderboard[i]['playerName']}</th>
                    <td className="noselect">{this.state.leaderboard[i]['mmr'] }</td>
                    <td className="noselect">{ Math.floor(this.state.leaderboard[i]['wins']/this.state.leaderboard[i]['games']) || 0}%</td>
                </tr>
            );
            }
        }

        return (
            <div>
                <div className="mainscreen-container">
                    <h1 className="noselect">3t</h1>
                    <div className="noselect">by <a href="https://tofoo.co" target="_blank">tofoo.co</a></div>

                    {!this.state.player.playerID ? (
                    <div style={{margin: "32px"}}>
                        <div style={{margin: "8px"}}>
                            <input id="playername" type="text" placeholder=" Player Name"></input>
                        </div>
                        <div style={{margin: "8px"}}>
                            <input id="passcode" type="text" placeholder=" Passcode"></input>
                        </div>
                        <div style={{margin: "8px", color: "red"}}>
                            {this.state.login_text}
                        </div>
                        
                        <div style={{margin: "8px"}}>
                            <button type="button" className="btn btn-outline-success ms-button" onClick={() => this.login()}>Enter</button>
                        </div>
                        <div style={{margin: "8px"}}>
                            <span><b>New User?</b></span>
                            <p>Create an account by entering a username and passcode!</p>
                        </div>
                    </div>
                    ) : (
                    <div className="select-mode container">
                        <span>Logged in as {this.state.player.playerName}</span><br/>
                        <span>MMR: {this.state.player.mmr}  Wins: {this.state.player.wins}  Games: {this.state.player.games}  </span>

                        <div className="row">
                            <div className='col mode'>
                                {this.state.create == null ? (
                                    <div onClick={() => this.createGame()}>
                                        <img src={x} width={'20%'}></img>
                                        <div className="options noselect">Create Room</div>	
                                    </div>
                                ) : (
                                    <div>
                                        <h4>Room Code</h4>
                                        <h2 className="gamecode">{this.state.create}</h2>
                                        <button type="button" className="btn btn-outline-danger" onClick={() => this.deleteGame()}>Cancel</button>
                                    </div>
                                ) }
                            </div>
                            <div className='col mode'>
                                {!this.state.join ? (
                                    <div onClick={() => this.joinToggle()}>
                                        <img src={o} width={'20%'}></img>
                                        <div className="options noselect">Join Room</div>	
                                    </div>
                                ) : (
                                    <div>
                                        <h3>Join Room</h3>
                                        <div>
                                            <input id="enter-room" type="text" placeholder=" Enter Code"></input>
                                        </div>
                                        <div>
                                            <button type="button" className="btn btn-outline-danger ms-button" onClick={() => this.joinToggle()}>Cancel</button>
                                            <button type="button" className="btn btn-outline-success ms-button" onClick={() => this.enterGame()}>Enter</button>
                                        </div>
                                    </div>
                                ) }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <h3 className="noselect">Live Games</h3>
                                <div>
                                    <table className="table table-hover live-games-table">
                                        <thead>
                                            <tr>
                                            <th scope="col" className="noselect">ID</th>
                                            <th scope="col" className="noselect">Player 1</th>
                                            <th scope="col" className="noselect">Player 2</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { lg }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col">
                                <h3 className="noselect">Leaderboards</h3>
                                <div>
                                    <table className="table table-hover live-games-table">
                                        <thead>
                                            <tr>
                                            <th scope="col" className="noselect">Rank</th>
                                            <th scope="col" className="noselect">Player</th>
                                            <th scope="col" className="noselect">MMR</th>
                                            <th scope="col" className="noselect">Win Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { lb }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        );
    }
}

function generateRoomID() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
    var result = '';
    for (var i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export default ReactAI.withTracking(MainScreen);