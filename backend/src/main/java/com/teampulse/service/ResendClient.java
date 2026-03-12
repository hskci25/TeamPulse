package com.teampulse.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Simple REST client for Resend API. Use when RESEND_API_KEY is set.
 */
public class ResendClient {

    private static final Logger log = LoggerFactory.getLogger(ResendClient.class);
    private static final String RESEND_URL = "https://api.resend.com/emails";

    private final String apiKey;
    private final String fromEmail;
    private final RestTemplate rest = new RestTemplate();

    public ResendClient(String apiKey, String fromEmail) {
        this.apiKey = apiKey;
        this.fromEmail = fromEmail != null && !fromEmail.isBlank() ? fromEmail : "TeamPulse <onboarding@resend.dev>";
    }

    public void send(String to, String subject, String html) {
        send(to, subject, html, null, null, null, null);
    }

    /** Plain text helps deliverability (less likely to go to spam). */
    public void send(String to, String subject, String html, String text) {
        send(to, subject, html, text, null, null, null);
    }

    /** @param attachmentBase64 optional; if non-null, attachmentFilename required */
    public void send(String to, String subject, String html, String attachmentFilename, String attachmentBase64) {
        send(to, subject, html, null, attachmentFilename, attachmentBase64, null);
    }

    /** Full form: optional plain text (reduces spam), optional attachment with content-type (e.g. text/calendar; method=REQUEST for .ics). */

    public void send(String to, String subject, String html, String text, String attachmentFilename, String attachmentBase64, String attachmentContentType) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        headers.set("User-Agent", "TeamPulse-Backend/1.0");

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("from", fromEmail);
        body.put("to", List.of(to));
        body.put("subject", subject);
        body.put("html", html);
        if (text != null && !text.isBlank()) {
            body.put("text", text);
        }
        if (attachmentBase64 != null && attachmentFilename != null) {
            Map<String, Object> att = new LinkedHashMap<>();
            att.put("filename", attachmentFilename);
            att.put("content", attachmentBase64);
            if (attachmentContentType != null && !attachmentContentType.isBlank()) {
                att.put("content_type", attachmentContentType);
            }
            body.put("attachments", List.of(att));
        }
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        try {
            rest.postForObject(RESEND_URL, entity, Map.class);
            log.info("Resend email sent: to={} subject='{}' attachment={}", to, subject, attachmentFilename != null);
        } catch (HttpClientErrorException e) {
            log.warn("Resend email failed ({}): to={} subject='{}' reason={}. To send to other recipients, verify a domain at resend.com/domains.",
                e.getStatusCode(), to, subject, e.getResponseBodyAsString());
        } catch (Exception e) {
            log.warn("Resend email failed: to={} subject='{}' error={}", to, subject, e.getMessage());
        }
    }
}
