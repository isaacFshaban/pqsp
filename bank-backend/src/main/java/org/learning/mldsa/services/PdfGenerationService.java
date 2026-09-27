package org.learning.mldsa.services;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.options.Margin;
import org.learning.mldsa.dtos.SlipRequest;
import org.learning.mldsa.models.UserType;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * Renders a payslip as HTML (via Thymeleaf) and prints that HTML to PDF using a real
 * headless Chromium instance (via Playwright) — the same mechanism as a browser's own
 * "Print to PDF", so tables/wrapping/layout behave exactly as they would on screen.
 *
 * REQUIRED DEPENDENCIES (add to pom.xml, not included here):
 *   org.springframework.boot:spring-boot-starter-thymeleaf
 *   com.microsoft.playwright:playwright, version 1.48.0 or later
 *
 * REQUIRED ONE-TIME SETUP, easy to miss: Playwright's Java package does NOT bundle a
 * browser. After adding the dependency, run once (from the project root, after a build):
 *   mvn exec:java -e -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="install chromium"
 * or equivalently:
 *   java -cp target/classes:$(find ~/.m2 -name 'playwright-*.jar' | tr '\n' ':') com.microsoft.playwright.CLI install chromium
 * Without this, Playwright.create() / .chromium().launch() will fail at runtime looking
 * for a browser executable that was never downloaded.
 *
 * Also requires two new classpath resources alongside slip.html:
 *   src/main/resources/templates/logo-institution.svg
 *   src/main/resources/templates/logo-bank.svg
 * These replace cardLogo.png, which was the real Bank of Tanzania emblem embedded directly
 * in the template (a reference screenshot's real branding that this project deliberately
 * does not reproduce — see the frontend's DashboardSidebar.tsx comment and the project's
 * research notes for the full reasoning). The two SVGs are this app's own generic
 * Institution/Bank marks, loaded once at startup and selected per payslip by the sender's
 * account type — see generateSlipPdf below.
 *
 * NOT VERIFIED BY COMPILATION OR EXECUTION — written without Maven, Thymeleaf, or
 * Playwright available in the environment this was authored in. Review carefully; render
 * a slip end-to-end before relying on this.
 */
@Service
public class PdfGenerationService {

    private final TemplateEngine templateEngine;

    // Loaded once at construction (fail fast on a missing resource at startup, rather than
    // on a user's first "compose slip" request) and reused for every PDF — these are fixed
    // server-side assets, never client input, so there's nothing to reload per request.
    private final String institutionLogoSvg;
    private final String bankLogoSvg;

    public PdfGenerationService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
        this.institutionLogoSvg = loadLogoSvg("/templates/logo-institution.svg");
        this.bankLogoSvg = loadLogoSvg("/templates/logo-bank.svg");
    }

    /**
     * Reads a classpath resource (Spring Boot's default Thymeleaf template resolver already
     * treats {@code src/main/resources/templates/} as classpath root {@code /templates/}, so
     * this mirrors exactly where slip.html itself is resolved from) as raw text. Plain
     * {@code Class.getResourceAsStream} rather than a Spring resource-loading API
     * deliberately — this file couldn't be compiled or run where it was written, so the
     * fewer unfamiliar APIs the review has to trust, the better.
     */
    private String loadLogoSvg(String classpathLocation) {
        try (InputStream in = getClass().getResourceAsStream(classpathLocation)) {
            if (in == null) {
                throw new IllegalStateException("Missing logo resource on classpath: " + classpathLocation);
            }
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to load logo resource: " + classpathLocation, e);
        }
    }

    /**
     * @param senderType which account type is sending this slip — selects the Institution or
     *                   Bank mark rendered in the PDF header. Always resolved server-side by
     *                   the caller (SlipController, from the authenticated sender's own User
     *                   row), never taken from the request body.
     * @return the rendered PDF as raw bytes. These bytes are what the caller should hash
     *         and sign directly — nothing about them passes through client-controlled
     *         input after this method returns; the only client input involved was the
     *         structured field values in {@code request}, embedded into a fixed template.
     */
    public byte[] generateSlipPdf(SlipRequest request, UserType senderType) {
        Context context = new Context();
        context.setVariable("slip", request);
        context.setVariable("totalEarnings", request.totalEarnings());
        context.setVariable("totalDeductions", request.totalDeductions());
        context.setVariable("netPay", request.netPay());
        context.setVariable("logoSvg", senderType == UserType.BANK ? bankLogoSvg : institutionLogoSvg);

        String html = templateEngine.process("slip", context);

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
            try {
                Page page = browser.newPage();
                page.setContent(html);
                return page.pdf(new Page.PdfOptions()
                        .setFormat("A4")
                        .setPrintBackground(true)
                        .setMargin(new Margin()
                                .setTop("30px")
                                .setBottom("30px")
                                .setLeft("20px")
                                .setRight("20px")));
            } finally {
                browser.close();
            }
        }
    }
}
