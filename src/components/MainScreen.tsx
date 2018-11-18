import * as React from "react";
import x from '../../src/x.png';
import o from '../../src/o.png';

interface IProps {
    screen: any
}

interface IState {
    // open: boolean
}

export default class MainScreen extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            // open: false
        }
        this.goToGame = this.goToGame.bind(this)
    }

	public render() {
        // const { open } = this.state;
        return (
            <div>
                <div className="mainpage-container">
                    <h1>3t</h1>
                    <div>by tofoo.co</div>

                    <div className="select-mode container">
                        <div className="row">
                            <div className='col mode'>
                                <img src={x} width={'20%'}></img>
                                <div className="options">Create Room</div>	
                            </div>
                            <div className='col mode'>
                                <img src={o} width={'20%'}></img>
                                <div className="options">Join Room</div>	
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <h3>Live Games</h3>
                                <div>
                                    <table className="table table-hover live-games-table">
                                        <thead>
                                            <tr>
                                            <th scope="col">ID</th>
                                            <th scope="col">Player 1</th>
                                            <th scope="col">Player 2</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            <th scope="row">35GHD6</th>
                                                <td>N</td>
                                                <td>Question Mark?</td>
                                            </tr>
                                            <tr>
                                            <th scope="row">GS234F</th>
                                                <td>Thornton</td>
                                                <td>kdl</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private goToGame() {
        this.props.screen('game');            
    }
}