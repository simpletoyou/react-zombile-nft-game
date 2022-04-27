import React, { Component } from 'react'
import ZombieCard from "./ZombieCard"
import './static/ZombiePreview.css'
import Page from "./Page"
import MyWeb3 from './MyWeb3'
import {
    BrowserRouter as
        Route,
    Link
} from "react-router-dom"

class MyZombie extends Component {
    constructor(props) {
        super(props);
        this.state = { zombieCount: "", zombies: [], zombieName: '', transactionHash: '', buyAreaDisp: 1, createAreaDisp: 1, txHashDisp: 0 }
        this.createZombie = this.createZombie.bind(this)
        this.buyZombie = this.buyZombie.bind(this)
        this.inputChange = this.inputChange.bind(this)
    }

    componentDidMount() {
        let that = this
        let ethereum = window.ethereum
        if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function (res) {
                that.myZombies()
            })
        } else {
            alert('You have to install MetaMask !')
        }
    }

    myZombies() {
        let that = this
        // 所有当前账号是否有僵尸，返回结果是僵尸id
        MyWeb3.getZombiesByOwner().then(function (zombies) {
            if (zombies.length > 0) {
                for (let i = 0; i < zombies.length; i++) {
                    // 遍历获取指定id僵尸详情
                    MyWeb3.zombies(zombies[i]).then(function (result) {
                        let _zombies = that.state.zombies
                        result.zombieId = zombies[i]
                        _zombies.push(result);
                        that.setState({ zombies: _zombies })
                    })
                }
            }
        })
    }
    // 创建僵尸事件
    createZombie() {
        let that = this
        let _name = this.state.zombieName
        MyWeb3.createZombie(_name).then(function (transactionHash) {
            that.setState({
                transactionHash: transactionHash,
                createAreaDisp: 0,
                txHashDisp: 1
            })
        })
    }
    // 购买僵尸事件
    buyZombie() {
        let that = this
        let _name = this.state.zombieName
        MyWeb3.buyZombie(_name).then(function (transactionHash) {
            that.setState({
                transactionHash: transactionHash,
                buyAreaDisp: 0,
                txHashDisp: 1
            })
        })
    }
    // 僵尸命名
    inputChange() {
        this.setState({
            zombieName: this.input.value
        })
    }


    render() {
        if (this.state.zombies.length > 0) {
            // 当前账号下有僵尸
            return (
                <div className="cards">
                    {/* 遍历我的僵尸列表 */}
                    {this.state.zombies.map((item, index) => {
                        var name = item.name
                        var level = item.level
                        return (
                            // 僵尸卡片，点击跳转到僵尸详情
                            <Link to={`?ZombieDetail&id=` + item.zombieId} key={index}>
                                <ZombieCard zombie={item} name={name} level={level} key={index}></ZombieCard>
                            </Link>
                        )
                    })}
                    <Route path="*" component={Page}></Route>
                    {/* 给新僵尸命名，生成新僵尸 */}
                    <div className='buyArea' display={this.state.buyAreaDisp}>
                        <div className='zombieInput'>
                            <input
                                type="text"
                                id='zombieName'
                                placeholder='给僵尸起个好名字'
                                ref={(input) => { this.input = input }}
                                value={this.state.zombieName}
                                onChange={this.inputChange}>
                            </input>
                        </div>
                        <div>
                            <button className="attack-btn" onClick={this.buyZombie}>
                                <span>
                                    购买僵尸
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className='transactionHash' display={this.state.txHashDisp}>{this.state.transactionHash}<br></br>等待确认中...</div>
                </div>
            )
        } else {
            // 当前账号下无僵尸
            return (<div>
                <div className='createArea' display={this.state.createAreaDisp}>
                    {/* 新账号可以有一只免费僵尸，生成新僵尸事件 */}
                    <div className='zombieInput'>
                        <input
                            type="text"
                            id='zombieName'
                            placeholder='给僵尸起个好名字'
                            ref={(input) => { this.input = input }}
                            value={this.state.zombieName}
                            onChange={this.inputChange}>
                        </input>
                    </div>
                    <div>
                        <button className="attack-btn" onClick={this.createZombie}>
                            <span>
                                免费领养僵尸
                            </span>
                        </button>
                    </div>
                </div>
                <div className='transactionHash' display={this.state.txHashDisp}>{this.state.transactionHash}<br></br>等待确认中...</div>
            </div>)
        }
    }
}
export default MyZombie;