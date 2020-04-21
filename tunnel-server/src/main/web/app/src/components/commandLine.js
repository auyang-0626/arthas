import React from 'react';
import {Terminal} from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';

Terminal.applyAddon(fit);

const divHeight = 17 * 30;
const id = "webConsole";

class CommandLine extends React.Component {


    constructor(props) {
        super(props);
        this.state = {}
        this.props.onRef(this)
    }

    componentDidMount() {

        let terminalContainer = document.getElementById(id);
        this.term = new Terminal({
            cols: Math.floor(parseInt(window.getComputedStyle(terminalContainer).width) / 10),
            rows: divHeight / 17,
            screenReaderMode: true,
            rendererType: 'canvas',
            convertEol: true,
            cursorBlink: true
        });
        // this.term.fit();
        this.term.open(terminalContainer);

        this.ws = this.props.getWs();
        this.onReady(this.ws);
    }

    onReady(ws) {
        let that = this;
        ws.onopen = function () {
            that.wsOpened(ws);
        }
    }

    wsOpened(ws) {
        let xterm = this.term;

        xterm.on('data', function (data) {
            ws.send(JSON.stringify({action: 'read', data: data}))
        });
        ws.onmessage = function (event) {
            if (event.type === 'message') {
                xterm.write(event.data);
            }
        };
        ws.send(JSON.stringify({action: 'resize', cols: this.term.cols, rows: this.term.rows}));
        window.setInterval(function () {
            if (ws != null) {
                ws.send(JSON.stringify({action: 'read', data: ""}));
            }
        }, 30000);


    }

    render() {
        return (
            <div id={id} style={{width: "100%", height: divHeight}}></div>
        )
    }
}


export default CommandLine;
