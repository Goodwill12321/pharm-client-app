package com.pharma.clientapp.storage;

import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;

import org.springframework.stereotype.Service;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

@Service
public class S3StorageService {

    private final S3StorageProperties props;
    private final S3Client s3;
    private final S3Presigner presigner;

    public S3StorageService(S3StorageProperties props, S3Client s3, S3Presigner presigner) {
        this.props = props;
        this.s3 = s3;
        this.presigner = presigner;
    }

    public void putObject(String key, String contentType, long sizeBytes, InputStream inputStream) throws IOException {
        if (props.getBucket() == null || props.getBucket().isBlank()) {
            throw new IllegalArgumentException("S3 bucket is not configured");
        }

        PutObjectRequest.Builder req = PutObjectRequest.builder()
                .bucket(props.getBucket())
                .key(key);

        if (contentType != null && !contentType.isBlank()) {
            req = req.contentType(contentType);
        }

        try (InputStream is = inputStream) {
            s3.putObject(req.build(), RequestBody.fromInputStream(is, sizeBytes));
        }
    }

    public void deleteObject(String key) {
        if (props.getBucket() == null || props.getBucket().isBlank()) {
            throw new IllegalArgumentException("S3 bucket is not configured");
        }

        s3.deleteObject(DeleteObjectRequest.builder()
                .bucket(props.getBucket())
                .key(key)
                .build());
    }

    public String createPresignedGetUrl(String key) {
        if (props.getBucket() == null || props.getBucket().isBlank()) {
            throw new IllegalArgumentException("S3 bucket is not configured");
        }

        Duration ttl = Duration.ofMinutes(props.getPresignTtlMinutes());

        GetObjectRequest getReq = GetObjectRequest.builder()
                .bucket(props.getBucket())
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(ttl)
                .getObjectRequest(getReq)
                .build();

        return presigner.presignGetObject(presignRequest).url().toString();
    }
}
