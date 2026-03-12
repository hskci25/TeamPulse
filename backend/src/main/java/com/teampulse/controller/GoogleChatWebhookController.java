package com.teampulse.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class GoogleChatWebhookController {

    private static final Logger log = LoggerFactory.getLogger(GoogleChatWebhookController.class);

    @PostMapping("/webhook")
    public ResponseEntity<Map<String, String>> handleEvent(@RequestBody Map<String, Object> payload) {

        log.info("=== GOOGLE CHAT EVENT RECEIVED ===");
        log.info("Payload: {}", payload);

        String eventType = (String) payload.get("type");
        log.info("Event type: {}", eventType);

        if ("ADDED_TO_SPACE".equals(eventType)) {
            log.info("Bot was added to a space");
            return ResponseEntity.ok(Map.of("text", "KarmaBot is here! Type @user++ to give karma."));
        }

        if ("MESSAGE".equals(eventType)) {
            Map<String, Object> message = (Map<String, Object>) payload.get("message");
            Map<String, Object> sender  = (Map<String, Object>) message.get("sender");

            String text        = (String) message.get("text");
            String senderName  = (String) sender.get("displayName");
            String senderEmail = (String) sender.get("email");

            log.info("Message from: {} ({})", senderName, senderEmail);
            log.info("Message text: {}", text);

            return ResponseEntity.ok(Map.of(
                "text", "✅ Got your message, " + senderName + "! You said: " + text
            ));
        }

        if ("REMOVED_FROM_SPACE".equals(eventType)) {
            log.info("Bot was removed from a space");
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.ok(Map.of("text", "Event received: " + eventType));
    }
}

