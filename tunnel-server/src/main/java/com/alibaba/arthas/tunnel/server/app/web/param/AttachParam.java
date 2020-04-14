package com.alibaba.arthas.tunnel.server.app.web.param;


public class AttachParam {

    private String ip;
    private String pid;
    private String javaHome;

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public String getJavaHome() {
        return javaHome;
    }

    public void setJavaHome(String javaHome) {
        this.javaHome = javaHome;
    }

    public String getAgentId(){
        return ip + "_" + pid;
    }
}
