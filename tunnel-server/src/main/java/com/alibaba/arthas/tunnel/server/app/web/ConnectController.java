package com.alibaba.arthas.tunnel.server.app.web;

import com.alibaba.arthas.tunnel.server.TunnelServer;
import com.alibaba.arthas.tunnel.server.app.web.param.AttachParam;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.catalina.connector.Response;
import org.apache.http.client.fluent.Request;
import org.apache.http.entity.ContentType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

/**
 * 主要是做连接管理
 * 编码比较简单，不采用分层策略了
 */
@CrossOrigin
@RequestMapping("api/connect")
@RestController
public class ConnectController {

    private final static Logger logger = LoggerFactory.getLogger(StatController.class);


    @Value("${connect.executeJpsUrl}")
    private String executeJpsUrl;
    @Value("${connect.executeAttachUrl}")
    private String executeAttachUrl;
    @Value("${connect.tunnelServerUrl}")
    private String tunnelServerUrl;

    @Autowired
    private TunnelServer tunnelServer;

    /**
     * 根据ip获取机器上的Java进程
     *
     * @param ip 机器IP
     * @return Java进程列表
     */
    @GetMapping("jps")
    public Map<Long, String> fetchJavaPidByHost(@RequestParam("ip") String ip) throws IOException {

        // 调用运维提供的接口执行jps操作，拿到范湖结果
        String resStr = Request.Get(String.format(executeJpsUrl, ip, "jps")).socketTimeout(10000)
                .execute().returnContent().asString();
        JSONObject responseJson = JSONObject.parseObject(resStr);
        if (responseJson.getInteger("code") != Response.SC_OK) {
            throw new IllegalArgumentException("连接失败：" + responseJson.getString("messages"));
        }

        //<pid,描述>
        Map<Long, String> result = new HashMap<>();
        String[] lines = responseJson.getString("data").split(",");
        Arrays.stream(lines).forEach(line -> {
            String[] arr = line.split(" ");
            if (arr.length == 2) {
                result.put(Long.parseLong(arr[0].trim()), arr[1].trim());
            }
        });
        return result;
    }

    @PostMapping("attach")
    public String attachAgent(@RequestBody AttachParam param) throws IOException {

        String agentId = param.getAgentId();
        // 已经存在的不需要重复执行
        /*if (tunnelServer.getAgentInfoMap().containsKey(agentId)) {
            return agentId;
        }*/
        String command = buildCommand(param, agentId);
        logger.info("准备执行:{}", command);

        JSONObject requestData = new JSONObject();
        requestData.put("ip", param.getIp());
        requestData.put("cli", command);

        String exeResult = Request.Post(executeAttachUrl)
                .bodyString(requestData.toJSONString(), ContentType.APPLICATION_JSON)
                .execute()
                .returnContent()
                .asString();
        logger.info("执行结果:{}", exeResult);

        return agentId;
    }

    /**
     * /opt/souche/java/bin/java
     * -Xbootclasspath/a:/opt/souche/java/lib/tools.jar
     * -jar /home/souche/bin/optimus-super/arthas-core.jar
     * -pid 19237 -target-ip 127.0.0.1 -telnet-port 3658 -http-port 8563
     * -core /home/souche/bin/optimus-super/arthas-core.jar
     * -agent /home/souche/bin/optimus-super/arthas-agent.jar
     * -tunnel-server 'ws://172.17.62.57:7777/ws'
     * -agent-id 172.17.62.57_28749
     */
    private String buildCommand(@RequestBody AttachParam param, String agentId) {
        List<String> commands = new ArrayList<>();
        commands.add(param.getJavaHome() + "/bin/java");
        commands.add("-Xbootclasspath/a:" + param.getJavaHome() + "/lib/tools.jar");
        commands.add("-jar /home/souche/bin/optimus-super/arthas-core.jar");
        commands.add("-target-ip 127.0.0.1 -telnet-port 3658 -http-port 8563 -pid " + param.getPid());
        commands.add("-core /home/souche/bin/optimus-super/arthas-core.jar -agent /home/souche/bin/optimus-super/arthas-agent.jar");
        commands.add("-tunnel-server " + tunnelServerUrl);
        commands.add("-agent-id " + agentId);
        return String.join(" ", commands);
    }


}
