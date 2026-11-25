package com.example.api_gateway.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> inicio() {
        return Map.of(
            "application", "API GATEWAY Microservicio Factura",
            "message", "Funcionando correctamente. Bienvenido al API GATEWAY de microservicios",
            "version", "1.0.0",
            "servicios", Map.of(
                "cliente", "/api/clientes",
                "producto", "/api/productos",
                "factura", "/api/facturas"
            )
        );
    }
}