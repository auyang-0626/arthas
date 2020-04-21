import React from 'react';
import ClassSelect from "./ClassSelect";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism';

let outputBuf = "";
// 这里的交互基于websocket(异步双工)，所以采用了类似于压栈的方式进行回调
// 尝试过通过注册 command的回调模式，但是会遇到换行导致命令匹配不上的问题
// 压栈方式要求必须按顺序同步调用
let callbackStack = [];

class DebugOnline extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            classSource: "",
        };
        this.props.onRef(this);
    }

    componentDidMount() {
        this.ws = this.props.getWs();

        let that = this;
        that.ws.onopen = function () {
            that.onReady(that.ws);
        }

    }

    onReady(ws) {
        let endFlag = "[arthas@" + this.props.pid + "]$ ";

        ws.send(JSON.stringify({action: 'resize', cols: 300, rows: 30}));
        ws.onmessage = function (event) {
            if (event.type === 'message') {
                if (event.data === endFlag) {
                    let res = outputBuf;
                    outputBuf = "";

                    let pos = res.indexOf("\n");
                    if (pos > 0) {
                        //let command = res.substr(0, pos).trim();
                        if (callbackStack.length >0) {
                            callbackStack.pop()(res.substr(pos + 1));
                        }
                    }
                } else {
                    outputBuf += event.data;
                }
            }
        };


    }

    sendAndCallBack(command, call) {
        let ws = this.ws;
        callbackStack.push(call)
        ws.send(JSON.stringify({action: 'read', data: command + "\n"}))
    }

    classSearch = (value, call) => {

        let command = "sc " + value;
        this.sendAndCallBack(command, call);
    };


    classJad = (value) => {

        let that = this;
        that.setState({classSource: ""})
        let command = "jad " + value + " --source-only --not-render";
        this.sendAndCallBack(command, function (res) {
            //console.log("classJad", res)
            that.setState({classSource: res})
        });
    }

    render() {
        return (
            <div>
                <ClassSelect classSearch={this.classSearch.bind(this)} classJad={this.classJad.bind(this)}/>
                {this.state.classSource ?
                    <SyntaxHighlighter showLineNumbers={true}
                                       startingLineNumber={1}
                                       language={"java"}
                                       style={dark}
                                       wrapLines={true}
                                       lineProps={(lineNumber) => ({
                                           style: { display: "block", cursor: "pointer" },
                                           onClick() {
                                               alert(`Line Number Clicked: ${lineNumber}`);
                                           }
                                       })}
                                       >
                        {this.state.classSource}
                    </SyntaxHighlighter> : ""}

            </div>
        )
    }
}

export default DebugOnline;
