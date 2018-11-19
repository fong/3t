import * as React from "react";
import x from '../../src/x.png';
import o from '../../src/o.png';

interface IProps {
    screen: any,
    username: any,
    usernameCallback: any
}

interface IState {
    // open: boolean
    username: any,
    create: any,
    join: any,
    auth_u: any,
    auth_p: any
}

export default class MainScreen extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props) 
        if (this.props.username) {
            this.state = {
                username: this.props.username,
                create: false,
                join: false,
                auth_u: "ok",
                auth_p: "ok"
            }
        } else {
            this.state = {
                username: null,
                create: false,
                join: false,
                auth_u: "empty",
                auth_p: "empty"
            } 
        }
        
        this.goToGame = this.goToGame.bind(this)
        this.createToggle = this.createToggle.bind(this)
        this.joinToggle = this.joinToggle.bind(this)
        this.authenticated = this.authenticated.bind(this)
    }

	public render() {
        // const { open } = this.state;
        let auth_u_state;
        let auth_p_state;

        if (this.state.auth_u === "ok"){
            auth_u_state = <i className="material-icons">check_circle_outline</i>
        } else if (this.state.auth_u === "error") {
            auth_u_state = <i className="material-icons">highlight_off</i>
        } else {
            auth_u_state = <i className="material-icons">panorama_fish_eye</i>
        }

        if (this.state.auth_p === "ok"){
            auth_p_state = <i className="material-icons">check_circle_outline</i>
        } else if (this.state.auth_p === "error") {
            auth_p_state = <i className="material-icons">highlight_off</i>
        } else {
            auth_p_state = <i className="material-icons">panorama_fish_eye</i>
        }


        return (
            <div>
                <div className="mainscreen-container">
                    <h1 className="noselect">3t</h1>
                    <div className="noselect">by <a href="https://tofoo.co" target="_blank">tofoo.co</a></div>

                    {!this.state.username ? (
                    <div style={{margin: "32px"}}>
                        <div style={{margin: "8px"}}>
                            <input type="text" placeholder=" Username"></input>
                            <span className="noselect">
                                &nbsp;{auth_u_state}
                            </span>
                        </div>
                        <div style={{margin: "8px"}}>
                            <input type="text" placeholder=" Passcode"></input>
                            <span className="noselect">
                                &nbsp;{auth_p_state}
                            </span>
                        </div>
                        
                        <div style={{margin: "8px"}}>
                            <button type="button" className="btn btn-outline-success ms-button" onClick={() => this.authenticated()}>Enter</button>
                        </div>
                        <div style={{margin: "8px"}}>
                            <span><b>New User?</b></span>
                            <p>Create an account by entering a username and passcode!</p>
                        </div>
                    </div>
                    ) : (
                    <div className="select-mode container">
                        <span>Logged in as USERNAME</span>
                        <div className="row">
                            <div className='col mode'>
                                {!this.state.create ? (
                                    <div onClick={() => this.createToggle()}>
                                        <img src={x} width={'20%'}></img>
                                        <div className="options noselect">Create Room</div>	
                                    </div>
                                ) : (
                                    <div>
                                        <h4>Room Code</h4>
                                        <h2>HOLSK4</h2>
                                        <button type="button" className="btn btn-outline-danger" onClick={() => this.createToggle()}>Cancel</button>
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
                                            <input type="text" placeholder=" Enter Code"></input>
                                        </div>
                                        <div>
                                            <button type="button" className="btn btn-outline-danger ms-button" onClick={() => this.joinToggle()}>Cancel</button>
                                            <button type="button" className="btn btn-outline-success ms-button" onClick={() => this.goToGame()}>Enter</button>
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
                                            <tr>
                                                <th scope="row" className="noselect">35GHD6</th>
                                                <td className="noselect">N</td>
                                                <td className="noselect">Question Mark?</td>
                                            </tr>
                                            <tr>
                                                <th scope="row" className="noselect">GS234F</th>
                                                <td className="noselect">Thornton</td>
                                                <td className="noselect">kdl</td>
                                            </tr>
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
                                            <th scope="col" className="noselect">Win Rate</th>
                                            <th scope="col" className="noselect">MMR</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th scope="row" className="noselect">1</th>
                                                <td className="noselect">N</td>
                                                <td className="noselect">50%</td>
                                                <td className="noselect">324</td>
                                            </tr>
                                            <tr>
                                                <th scope="row" className="noselect">2</th>
                                                <td className="noselect">Thornton</td>
                                                <td className="noselect">45%</td>
                                                <td className="noselect">280</td>
                                            </tr>
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

    private goToGame() {
        this.props.screen('game');            
    }

    private authenticated() {
        this.setState({
            username: 'test_username'
        });
        this.props.usernameCallback('test_username');
    }

    private createToggle() {
        this.setState({create: !this.state.create});
    }

    private joinToggle() {
        this.setState({join: !this.state.join});
    }
}