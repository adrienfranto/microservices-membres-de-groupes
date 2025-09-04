package com.techie.microservices.api_gateway.routes;

import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class Routes {

    @Bean
    public RouterFunction<ServerResponse> etudiantServiceRoute(){
        return GatewayRouterFunctions.route("etudiant_service")
                .route(RequestPredicates.path("/api/etudiants/**"), HandlerFunctions.http("http://192.168.107.50:8080"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> orderServiceRoute(){
        return GatewayRouterFunctions.route("travail_service")
                .route(RequestPredicates.path("/api/travail/**"),HandlerFunctions.http("http://192.168.107.50:8081"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> inventoryRoute(){
        return GatewayRouterFunctions.route("groupe_service")
                .route(RequestPredicates.path("/api/groupes/**"),HandlerFunctions.http("http://192.168.107.50:8082"))
                .build();
    }
}
