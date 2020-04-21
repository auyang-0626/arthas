import React from 'react';
import Header from "./header";
import {message, Tabs} from "antd";
import CommandLine from "./commandLine";
import DebugOnline from "./debug_online/DebugOnline";
import InitWebSocket from "../webSocket";

const { TabPane } = Tabs;

class Home extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            targetIp: null,
            targetPid: null,
            agentId:null,
        }
    }

    onReady = (ip, pid,agentId) => {
        this.setState({
            connected: true,
            targetIp: ip,
            targetPid: pid,
            agentId:agentId,
        })
    }

    getWs1(){
        if (!this.ws1) {
            let that = this;

            let ws1 = InitWebSocket.create(this.state.agentId);
            ws1.onerror = function () {
                message.error("连接失败！")
                that.setState({
                    connected: false
                })
            };
            ws1.onclose = function (res) {
                if (res.code === 2000) {
                    message.error(res.reason)
                }
                that.setState({
                    connected: false
                })
            };
            this.ws1 = ws1;
            console.info(this.ws1)
        }
        return this.ws1;
    }
    getWs2(){
        if (!this.ws2) {
            let that = this;

            let ws2 = InitWebSocket.create(this.state.agentId);
            ws2.onerror = function () {
                message.error("连接失败！")
                that.setState({
                    connected: false
                })
                that.ws1 = null;
                that.ws2 = null;
            };
            ws2.onclose = function (res) {
                if (res.code === 2000) {
                    message.error(res.reason)
                }
                that.setState({
                    connected: false
                })
                that.ws1 = null;
                that.ws2 = null;
            };
            this.ws2 = ws2;
        }

        return this.ws2;
    }

    xtermOnRef(ref){
        this.xtermRef = ref;
    }
    debugOnLineOnRef(ref){
        this.debugOnLine = ref;
    }
    onDisconnect(){
        this.setState({
            connected: false
        });
    }



    render() {
        return(
            <div>
                <Header connected={this.state.connected}
                        targetIp={this.state.targetIp}
                        targetPid={this.state.targetPid}
                        onReady={this.onReady.bind(this)}
                        onDisconnect={this.onDisconnect.bind(this)}
                />
                <div style={{marginTop:20}}>
                    {this.state.connected?<Tabs defaultActiveKey="1">
                        <TabPane tab="Web控制台" key="1">
                            <CommandLine onRef={this.xtermOnRef.bind(this)} getWs={this.getWs1.bind(this)}/>
                        </TabPane>
                        <TabPane tab="在线debug" key="2">
                            <DebugOnline onRef={this.debugOnLineOnRef.bind(this)} getWs={this.getWs2.bind(this)} pid={this.state.targetPid} />
                        </TabPane>
                    </Tabs>:""}
                </div>
            </div>
        )
    }
}
export default Home;
