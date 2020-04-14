import React from 'react';
import Header from "./header";
import {Tabs,message} from "antd";
import CommandLine from "./commandLine";

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
        let that = this;
        this.ws = this.initWs(agentId)

        let ws = this.ws;
        ws.onerror = function () {
            that.ws = null;
            message.error("连接失败！")
            that.setState({
                connected: false
            })
        };
        ws.onclose = function (res) {
            if (res.code === 2000) {
                message.error(res.reason)
            }
            that.setState({
                connected: false
            })
        };
        ws.onopen = function () {
            that.xtermRef.wsOpened(ws);
        }

    }

    xtermOnRef(ref){
        this.xtermRef = ref;
    }
    /** init websocket **/
    initWs (agentId) {
        //todo 要区分测试和线上
        let domain = "172.17.62.57:7777";
        const path = 'ws://' +domain+ '/ws?method=connectArthas&id=' + agentId;
        return  new WebSocket(path);
    }

    onDisconnect(){
        console.info("dis")
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
                            <CommandLine onRef={this.xtermOnRef.bind(this)}/>
                        </TabPane>
                        <TabPane tab="在线debug" key="2">
                            Content of Tab Pane 2
                        </TabPane>
                    </Tabs>:""}
                </div>
            </div>
        )
    }
}
export default Home;
