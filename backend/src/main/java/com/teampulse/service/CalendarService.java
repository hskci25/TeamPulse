package com.teampulse.service;

import com.teampulse.domain.Plan;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

/**
 * Generates an ICS calendar invite (METHOD:REQUEST) for a confirmed plan so mail clients
 * show "Add to calendar" / Accept.
 */
@Service
public class CalendarService {

    private static final DateTimeFormatter ICS_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'");
    private static final String ORGANIZER = "mailto:noreply@teampulse.app";

    /** ICS as Base64 for the given attendee (recipient email). */
    public String toIcsBase64(Plan plan, String winnerName, String attendeeEmail) {
        String ics = buildIcs(plan, winnerName, attendeeEmail != null ? attendeeEmail.trim() : "");
        return Base64.getEncoder().encodeToString(ics.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    /** Backward compatible: no attendee (e.g. when not sending per-recipient). */
    public String toIcsBase64(Plan plan, String winnerName) {
        return toIcsBase64(plan, winnerName, null);
    }

    private static String buildIcs(Plan plan, String winnerName, String attendeeEmail) {
        Instant start = plan.getDateTime() != null ? plan.getDateTime() : Instant.now();
        Instant end = start.plusSeconds(7200); // 2 hours default
        String uid = "teampulse-" + plan.getId() + "@teampulse.app";
        String dtStart = start.atOffset(ZoneOffset.UTC).format(ICS_FORMAT);
        String dtEnd = end.atOffset(ZoneOffset.UTC).format(ICS_FORMAT);
        String summary = plan.getTitle() + " — " + winnerName;
        String description = "TeamPulse plan: " + plan.getTitle() + ". Winner: " + winnerName;
        String attendeeLine = attendeeEmail.isBlank() ? "" : "ATTENDEE;CN=" + escapeIcs(attendeeEmail) + ";PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:" + attendeeEmail + "\r\n";
        return """
            BEGIN:VCALENDAR
            VERSION:2.0
            PRODID:-//TeamPulse//EN
            METHOD:REQUEST
            BEGIN:VEVENT
            UID:%s
            DTSTAMP:%s
            DTSTART:%s
            DTEND:%s
            ORGANIZER:%s
            %sSUMMARY:%s
            DESCRIPTION:%s
            END:VEVENT
            END:VCALENDAR
            """.formatted(uid, dtStart, dtStart, dtEnd, ORGANIZER, attendeeLine, escapeIcs(summary), escapeIcs(description));
    }

    private static String escapeIcs(String s) {
        return s.replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace("\n", "\\n");
    }
}
