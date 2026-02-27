package com.pharma.clientapp.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class S3StorageProperties {

    @Value("${S3_ENDPOINT:}")
    private String endpoint;

    @Value("${S3_REGION:us-east-1}")
    private String region;

    @Value("${S3_BUCKET:}")
    private String bucket;

    @Value("${S3_ACCESS_KEY:}")
    private String accessKey;

    @Value("${S3_SECRET_KEY:}")
    private String secretKey;

    @Value("${S3_FORCE_PATH_STYLE:true}")
    private boolean forcePathStyle;

    @Value("${S3_PRESIGN_TTL_MINUTES:15}")
    private long presignTtlMinutes;

    public String getEndpoint() {
        return endpoint;
    }

    public String getRegion() {
        return region;
    }

    public String getBucket() {
        return bucket;
    }

    public String getAccessKey() {
        return accessKey;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public boolean isForcePathStyle() {
        return forcePathStyle;
    }

    public long getPresignTtlMinutes() {
        return presignTtlMinutes;
    }
}
