package com.alibaba.arthas.tunnel.server.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@ServletComponentScan
@SpringBootApplication(scanBasePackages = { "com.alibaba.arthas.tunnel.server.app",
        "com.alibaba.arthas.tunnel.server.endpoint" })
public class ArthasTunnelApplication {

    public static void main(String[] args) {
        SpringApplication.run(ArthasTunnelApplication.class, args);
    }

}
