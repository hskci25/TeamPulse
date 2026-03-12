package com.teampulse.service;

import com.teampulse.domain.Member;
import com.teampulse.domain.Plan;
import com.teampulse.domain.Team;
import com.teampulse.domain.VoterToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Value("${app.base-url:http://localhost:5173}")
    private String appBaseUrl;

    private final Optional<ResendClient> client;
    private final CalendarService calendarService;

    public EmailService(@Value("${resend.api-key:}") String apiKey,
                        @Value("${resend.from-email:TeamPulse <onboarding@resend.dev>}") String fromEmail,
                        CalendarService calendarService) {
        this.client = (apiKey != null && !apiKey.isBlank())
            ? Optional.of(new ResendClient(apiKey, fromEmail))
            : Optional.empty();
        this.calendarService = calendarService;
        if (this.client.isEmpty()) {
            log.warn("Resend API key not set (resend.api-key). Result and invite emails will NOT be sent. Set RESEND_API_KEY to enable.");
        } else {
            log.info("Resend email client enabled. Result/invite emails will be sent.");
        }
    }

    public void sendWelcomeEmails(Team team, List<Member> members) {
        if (client.isEmpty()) return;
        log.info("Sending welcome emails for team id={} to {} member(s)", team.getId(), members.size());
        for (Member m : members) {
            client.get().send(m.getEmail(), "You're on " + team.getName() + " — TeamPulse",
                welcomeHtml(team.getName(), appBaseUrl), welcomeText(team.getName(), appBaseUrl));
        }
    }

    public void sendVoteInviteEmails(Plan plan, Team team, List<VoterToken> tokens) {
        if (client.isEmpty()) return;
        log.info("Sending vote invite emails for plan id={} to {} recipient(s)", plan.getId(), tokens.size());
        for (VoterToken vt : tokens) {
            String voteUrl = appBaseUrl + "/vote/" + plan.getId() + "?token=" + vt.getToken();
            client.get().send(vt.getMemberEmail(),
                "Vote: " + plan.getTitle() + " — " + team.getName(),
                voteInviteHtml(plan.getTitle(), plan.getDeadline(), voteUrl, team.getName()),
                voteInviteText(plan.getTitle(), plan.getDeadline(), voteUrl, team.getName()));
        }
    }

    public void sendResultEmails(Plan plan, Team team, List<Member> members, String winnerName, boolean confirmed) {
        if (client.isEmpty()) {
            log.debug("Skipping result emails (no Resend client) for plan id={}", plan.getId());
            return;
        }
        boolean withCalendar = confirmed && winnerName != null && !winnerName.isBlank();
        log.info("Sending result emails for plan id={} title='{}' confirmed={} withCalendarInvite={} to {} member(s)",
            plan.getId(), plan.getTitle(), confirmed, withCalendar, members.size());
        String teamName = team.getName() != null ? team.getName() : "Your team";
        for (Member m : members) {
            String subject = confirmed ? "Confirmed: " + plan.getTitle() + " — " + winnerName : "Cancelled: " + plan.getTitle();
            String html = resultHtml(plan.getTitle(), winnerName, confirmed, teamName);
            String text = resultText(plan.getTitle(), winnerName, confirmed, teamName);
            if (withCalendar) {
                String icsBase64 = calendarService.toIcsBase64(plan, winnerName, m.getEmail());
                client.get().send(m.getEmail(), subject, html, text, "invite.ics", icsBase64,
                    "text/calendar; method=REQUEST; charset=utf-8");
            } else {
                client.get().send(m.getEmail(), subject, html, text, null, null, null);
            }
        }
    }

    private static String welcomeHtml(String teamName, String baseUrl) {
        return """
            <!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;}</style></head><body>
            <h2>You're on %s</h2>
            <p>Your team uses <strong>TeamPulse</strong> to plan activities without the usual "what are we doing Friday?" chaos.</p>
            <p>When someone creates a plan, you'll get an email with a <strong>private voting link</strong>. One click, anonymous vote — no threads.</p>
            <p><a href="%s" style="background:#2563eb;color:white;padding:10px 16px;text-decoration:none;border-radius:8px;">Open TeamPulse</a></p>
            </body></html>
            """.formatted(teamName, baseUrl);
    }

    private static String welcomeText(String teamName, String baseUrl) {
        return "You're on " + teamName + "\n\nYour team uses TeamPulse to plan activities. When someone creates a plan, you'll get an email with a private voting link. One click, anonymous vote.\n\nOpen TeamPulse: " + baseUrl;
    }

    private static String voteInviteHtml(String planTitle, java.time.Instant deadline, String voteUrl, String teamName) {
        String deadlineStr = deadline != null ? deadline.toString() : "soon";
        return """
            <!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;}</style></head><body>
            <h2>%s</h2>
            <p><strong>%s</strong> — vote by deadline: %s</p>
            <p><a href="%s" style="background:#2563eb;color:white;padding:10px 16px;text-decoration:none;border-radius:8px;">Vote now (anonymous)</a></p>
            </body></html>
            """.formatted(planTitle, teamName, deadlineStr, voteUrl);
    }

    private static String voteInviteText(String planTitle, java.time.Instant deadline, String voteUrl, String teamName) {
        String deadlineStr = deadline != null ? deadline.toString() : "soon";
        return planTitle + "\n\n" + teamName + " — vote by deadline: " + deadlineStr + "\n\nVote now (anonymous): " + voteUrl;
    }

    private static String resultHtml(String planTitle, String winnerName, boolean confirmed, String teamName) {
        if (confirmed) {
            return """
                <!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;}</style></head><body>
                <h2>✅ Plan confirmed</h2>
                <p><strong>%s</strong> — %s</p>
                <p>Winner: <strong>%s</strong>.</p>
                <p>Voting is now closed. A calendar invite (<strong>invite.ics</strong>) is attached — add the event to your calendar from your email client.</p>
                </body></html>
                """.formatted(teamName, planTitle, winnerName);
        } else {
            return """
                <!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;}</style></head><body>
                <h2>❌ Plan cancelled</h2>
                <p><strong>%s</strong> — %s</p>
                <p>Not enough votes by the deadline. A new plan may be suggested for next week.</p>
                </body></html>
                """.formatted(teamName, planTitle);
        }
    }

    private static String resultText(String planTitle, String winnerName, boolean confirmed, String teamName) {
        if (confirmed) {
            return "Plan confirmed\n\n" + teamName + " — " + planTitle + "\nWinner: " + winnerName + ".\n\nVoting is closed. A calendar invite is attached (invite.ics). Add the event from your email client.";
        } else {
            return "Plan cancelled\n\n" + teamName + " — " + planTitle + "\n\nNot enough votes by the deadline.";
        }
    }
}
