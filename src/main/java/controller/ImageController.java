package controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
public class ImageController {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @GetMapping("/images/custom/{assetId:.+}")
    public ResponseEntity<?> getImage(@PathVariable String assetId) {
        if (assetId == null || assetId.isBlank()) {
            return ResponseEntity.notFound().build();
        }

        // Si el assetId ya es una URL completa
        if (assetId.startsWith("http://") || assetId.startsWith("https://")) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header(HttpHeaders.LOCATION, assetId)
                    .build();
        }

        // Comprobación de retrocompatibilidad: si la imagen existe localmente en disco
        try {
            Path localFilePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(assetId);
            if (Files.exists(localFilePath) && !Files.isDirectory(localFilePath)) {
                Resource resource = new UrlResource(localFilePath.toUri());
                String contentType = Files.probeContentType(localFilePath);
                if (contentType == null) {
                    contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                }
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            }
        } catch (Exception ignored) {
        }

        // En caso contrario, se interpreta como ID único de Imgur (ej: bX7q9K2)
        String imgurUrl = "https://i.imgur.com/" + (assetId.contains(".") ? assetId : assetId + ".jpg");
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, imgurUrl)
                .build();
    }
}
