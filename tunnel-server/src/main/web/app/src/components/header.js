import React from 'react';
import {Button, Form, Input, message} from "antd";
import connectService from "../service/connectService";
import PidSelect from "./pidSelect";


const ipExp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

const {Search} = Input;

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            jpsLoading: false,
            pidMap: {},
            ip:null,
        }
    }

    pidSelectOnRef = (ref) => {
        this.pidSelectRef = ref;
    }

    onConnect = (ip) => {
        let that = this;
        if (ip && ip.match(ipExp)) {
            that.setState({jpsLoading: true})
            connectService.jps(ip, function (res) {
                that.setState({jpsLoading: false, pidMap: res,ip:ip})
                that.pidSelectRef.showModel();
            }, function (error) {
                that.setState({jpsLoading: false})
            });
        } else {
            message.warn("请输入正确的IP地址！");
        }
    }

    onPidSelected = (pid,agentId) =>{
        this.props.onReady(this.state.ip,pid,agentId)
    }


    render() {


        return (
            <div style={{paddingTop:10,paddingLeft:20}}>
                <Form
                    name="customized_form_connection"
                    layout="inline"
                    onFinish={this.onFinish}
                    initialValues={{
                        ip: this.props.targetIp,
                    }}
                >
                    <Form.Item name={'ip'} label="机器IP" rules={[{required: true}]}>
                        <Search placeholder="请输入IP地址" style={{width: 300}}
                                onSearch={value => this.onConnect(value)}
                                loading={this.state.jpsLoading}
                                disabled={this.props.connected}
                                enterButton={"连接"}
                        />
                    </Form.Item>
                    {
                        this.props.connected?<Form.Item label="进程">
                            {this.state.pidMap[this.props.targetPid]}

                        </Form.Item>:""
                    }
                    {this.props.connected?<Button type="primary" onClick={e=>this.props.onDisconnect()} style={{float:"left"}} danger >断开</Button>:""}

                </Form>

                <PidSelect pidModelVisible={this.state.pidModelVisible}
                           pidMap={this.state.pidMap}
                           ip={this.state.ip}
                           onRef={this.pidSelectOnRef}
                           onPidSelected={this.onPidSelected.bind(this)}
                />
            </div>
        )
    }
}

export default Header;
