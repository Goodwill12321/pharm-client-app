package com.pharma.clientapp.storage;

import java.net.URI;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Configuration
public class S3StorageConfig {

    @Bean
    public S3Client s3Client(S3StorageProperties props) {
        var builder = S3Client.builder()
                .region(Region.of(props.getRegion()))
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(props.isForcePathStyle())
                        .build());

        if (props.getEndpoint() != null && !props.getEndpoint().isBlank()) {
            builder = builder.endpointOverride(URI.create(props.getEndpoint()));
        }

        if (props.getAccessKey() != null && !props.getAccessKey().isBlank()
                && props.getSecretKey() != null && !props.getSecretKey().isBlank()) {
            builder = builder.credentialsProvider(StaticCredentialsProvider.create(
                    AwsBasicCredentials.create(props.getAccessKey(), props.getSecretKey())));
        }

        return builder.build();
    }

    @Bean
    public S3Presigner s3Presigner(S3StorageProperties props) {
        var builder = S3Presigner.builder()
                .region(Region.of(props.getRegion()));

        if (props.getEndpoint() != null && !props.getEndpoint().isBlank()) {
            builder = builder.endpointOverride(URI.create(props.getEndpoint()));
        }

        if (props.getAccessKey() != null && !props.getAccessKey().isBlank()
                && props.getSecretKey() != null && !props.getSecretKey().isBlank()) {
            builder = builder.credentialsProvider(StaticCredentialsProvider.create(
                    AwsBasicCredentials.create(props.getAccessKey(), props.getSecretKey())));
        }

        return builder.build();
    }
}
