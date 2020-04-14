/*
 * @Author: yanggy
 * @Description: ~~
 * @Date: Create in 10:03 上午 2019/9/17
 */

package com.alibaba.arthas.tunnel.server.app.web;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.cors.CorsUtils;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter(filterName = "logFilter" , urlPatterns = "/*")
public class LogFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain filterChain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse)res;
        HttpServletRequest request = (HttpServletRequest)req;



// 此处可以进行白名单检测
        if(CorsUtils.isCorsRequest(request)) {
            response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Headers", request.getHeader("Access-Control-Request-Headers"));
            response.setHeader("Access-Control-Allow-Methods", request.getHeader("Access-Control-Request-Method"));
            response.setHeader("Access-Control-Max-Age", "3600");
        }
        if(CorsUtils.isPreFlightRequest(request)) {
            return;
        }
        filterChain.doFilter(request, response);
    }

    @Override
    public void destroy() {

    }
}
