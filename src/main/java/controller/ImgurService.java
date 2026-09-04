package controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ImgurService {

    @Value("${app.imgur.client-id:546c25a59c58ad7}")
    private String clientId;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final Pattern ID_PATTERN = Pattern.compile("\"id\"\\s*:\\s*\"([^\"]+)\"");

    /**
     * Subes una imagen a Imgur vía API v3.
     *
     * @param file Archivo subido
     * @return El ID único generado por Imgur (ej: bX7q9K2) o null si falla
     */
    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            String url = "https://api.imgur.com/3/image";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.set("Authorization", "Client-ID " + clientId.trim());

            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload.jpg";
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", fileResource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Matcher matcher = ID_PATTERN.matcher(response.getBody());
                if (matcher.find()) {
                    String id = matcher.group(1);
                    if (id != null && !id.isBlank()) {
                        return id;
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error al subir imagen a Imgur API: " + e.getMessage());
        }
        return null;
    }
}
