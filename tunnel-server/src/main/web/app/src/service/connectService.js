import http from '../http'

const baseUrl = "/api/connect";
let connectService = {
    jps:function (ip,call,onError) {
        http.get(baseUrl+"/jps?ip="+ip)
            .then(function (response) {
                call(response);
            })
            .catch(function (error) {
                if (onError){
                    onError(error)
                }
            })
    },
    attach:function(data,call) {
        http.post(baseUrl+"/attach",data)
            .then(function (response) {
                call(response);
            })
    }

};

export default connectService;
