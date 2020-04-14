import React from 'react';
import {Terminal} from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';

Terminal.applyAddon(fit);

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
            screenReaderMode: true,
            rendererType: 'canvas',
            convertEol: true,
            cursorBlink: true
        });
       // this.term.fit();
        this.term.open(terminalContainer);
    }

    wsOpened(ws) {
        let xterm  = this.term;

        xterm.on('data', function (data) {
            ws.send(JSON.stringify({action: 'read', data: data}))
        });
        ws.onmessage = function (event) {
            if (event.type === 'message') {
                xterm.write(event.data);
            }
        };
        // ws.send(JSON.stringify({action: 'resize', cols: terminalSize.cols, rows: terminalSize.rows}));
        window.setInterval(function () {
            if (ws != null) {
                ws.send(JSON.stringify({action: 'read', data: ""}));
            }
        }, 30000);
    }

    render() {
        return (
            <div id={id}></div>
        )
    }
}


export default CommandLine;
