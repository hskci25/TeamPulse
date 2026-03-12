package com.teampulse.scheduler;

import com.teampulse.service.PlanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DeadlineScheduler {

    private static final Logger log = LoggerFactory.getLogger(DeadlineScheduler.class);

    private final PlanService planService;

    public DeadlineScheduler(PlanService planService) {
        this.planService = planService;
    }

    /** Run every 1 hour to close plans past deadline and send result emails. First run 5 minutes after startup. */
    @Scheduled(initialDelay = 300_000, fixedRate = 3_600_000)
    public void processDeadlines() {
        int processed = planService.processDeadlinePassed();
        log.info("Deadline scheduler run: {} plan(s) past deadline (processed)", processed);
    }
}
