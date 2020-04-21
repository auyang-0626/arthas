let InitWebSocket = {
    create:function (agentId) {
        //todo 要区分测试和线上
        let domain = "172.17.62.57:7777";
        const path = 'ws://' +domain+ '/ws?method=connectArthas&id=' + agentId;
        return  new WebSocket(path);
    }
};

export default InitWebSocket;