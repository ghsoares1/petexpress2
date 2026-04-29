package com.petexpress.petexpress_site_backend.controller;

import com.petexpress.petexpress_site_backend.config.MercadoPagoConfig;
import com.petexpress.petexpress_site_backend.model.PagamentoCartItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pagamento")
@CrossOrigin(origins = "*")
public class PagamentoController {

    private static final Logger logger = LoggerFactory.getLogger(PagamentoController.class);

    private final MercadoPagoConfig mercadoPagoConfig;
    private final RestTemplate restTemplate;

    public PagamentoController(MercadoPagoConfig mercadoPagoConfig, RestTemplate restTemplate) {
        this.mercadoPagoConfig = mercadoPagoConfig;
        this.restTemplate = restTemplate;
    }

    @PostMapping("/criar-preferencia")
    public ResponseEntity<Map<String, Object>> criarPreferencia(@RequestBody List<PagamentoCartItem> carrinho) {
        logger.info("Recebida requisição POST /api/pagamento/criar-preferencia com {} itens", carrinho == null ? 0 : carrinho.size());
        if (carrinho == null || carrinho.isEmpty()) {
            logger.warn("Carrinho vazio recebido");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Carrinho vazio.");
        }

        List<Map<String, Object>> items = new ArrayList<>();
        for (PagamentoCartItem item : carrinho) {
            if (item == null || item.getTitle() == null || item.getQuantity() == null || item.getPrice() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Itens do carrinho inválidos.");
            }
            Map<String, Object> itemMap = new LinkedHashMap<>();
            itemMap.put("title", item.getTitle());
            itemMap.put("quantity", item.getQuantity());
            itemMap.put("unit_price", item.getPrice());
            itemMap.put("currency_id", "BRL");
            items.add(itemMap);
        }

        logger.info("Itens recebidos para preferencia Mercado Pago: {}", items);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("items", items);
        requestBody.put("back_urls", Map.of(
                "success", "http://localhost:8082/sucesso.html",
                "failure", "http://localhost:8082/falha.html",
                "pending", "http://localhost:8082/pendente.html"
        ));

        logger.info("Payload enviado ao Mercado Pago: {}", requestBody);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(mercadoPagoConfig.getAccessToken());

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response;
        try {
            response = restTemplate.postForEntity("https://api.mercadopago.com/checkout/preferences", httpEntity, Map.class);
        } catch (RestClientException ex) {
            logger.error("Erro ao chamar Mercado Pago: {}", ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Falha na comunicação com Mercado Pago.");
        }

        logger.info("Resposta Mercado Pago status={}, body={}", response.getStatusCode(), response.getBody());

        if (response.getStatusCode() != HttpStatus.CREATED && response.getStatusCode() != HttpStatus.OK) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Falha ao criar preferência no Mercado Pago.");
        }

        Map<String, Object> responseBody = response.getBody();
        if (responseBody == null || !responseBody.containsKey("init_point")) {
            logger.error("Resposta inválida do Mercado Pago: {}", responseBody);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Resposta inválida do Mercado Pago.");
        }

        return ResponseEntity.ok(Map.of("init_point", responseBody.get("init_point")));
    }
}
