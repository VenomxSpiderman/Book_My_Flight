package com.example.rest_service;

import java.net.URI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RestServiceApplication {

    public static void main(String[] args) {
        normalizeDatasourceSettings();
        SpringApplication.run(RestServiceApplication.class, args);
    }

    private static void normalizeDatasourceSettings() {
        String rawUrl = firstNonBlankEnv("SPRING_DATASOURCE_URL", "DATABASE_URL");
        if (rawUrl == null) {
            return;
        }

        String normalizedUrl = rawUrl;
        if (rawUrl.startsWith("postgres://")) {
            normalizedUrl = toJdbcPostgresUrl(rawUrl, "postgres://");
        } else if (rawUrl.startsWith("postgresql://")) {
            normalizedUrl = toJdbcPostgresUrl(rawUrl, "postgresql://");
        }

        System.setProperty("spring.datasource.url", normalizedUrl);

        if (System.getenv("SPRING_DATASOURCE_USERNAME") == null || System.getenv("SPRING_DATASOURCE_PASSWORD") == null) {
            populateCredentialsFromUrl(rawUrl);
        }
    }

    private static String toJdbcPostgresUrl(String rawUrl, String prefix) {
        String parseableUrl = rawUrl.startsWith("postgres://")
                ? "postgresql://" + rawUrl.substring("postgres://".length())
                : rawUrl;

        try {
            URI uri = URI.create(parseableUrl);
            if (uri.getHost() == null || uri.getPath() == null || uri.getPath().isBlank()) {
                return "jdbc:postgresql://" + rawUrl.substring(prefix.length());
            }

            StringBuilder jdbc = new StringBuilder("jdbc:postgresql://").append(uri.getHost());
            if (uri.getPort() > 0) {
                jdbc.append(":").append(uri.getPort());
            }
            jdbc.append(uri.getPath());
            if (uri.getQuery() != null && !uri.getQuery().isBlank()) {
                jdbc.append("?").append(uri.getQuery());
            }
            return jdbc.toString();
        } catch (IllegalArgumentException ignored) {
            return "jdbc:postgresql://" + rawUrl.substring(prefix.length());
        }
    }

    private static void populateCredentialsFromUrl(String rawUrl) {
        String parseableUrl = rawUrl.startsWith("postgres://")
                ? "postgresql://" + rawUrl.substring("postgres://".length())
                : rawUrl;

        try {
            URI uri = URI.create(parseableUrl);
            String userInfo = uri.getUserInfo();
            if (userInfo == null || userInfo.isBlank()) {
                return;
            }

            String[] parts = userInfo.split(":", 2);
            if (System.getenv("SPRING_DATASOURCE_USERNAME") == null && parts.length > 0 && !parts[0].isBlank()) {
                System.setProperty("spring.datasource.username", parts[0]);
            }
            if (System.getenv("SPRING_DATASOURCE_PASSWORD") == null && parts.length > 1 && !parts[1].isBlank()) {
                System.setProperty("spring.datasource.password", parts[1]);
            }
        } catch (IllegalArgumentException ignored) {
            // Keep defaults if URL cannot be parsed.
        }
    }

    private static String firstNonBlankEnv(String... keys) {
        for (String key : keys) {
            String value = System.getenv(key);
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

}
