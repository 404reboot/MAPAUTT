package controller;

import model.AreaVerde;
import model.Edificio;
import model.Especie;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Controller
public class AdminPanelController {

    @Autowired
    private MapService mapService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private void deletePhysicalFile(String assetId) {
        if (assetId == null || assetId.trim().isEmpty()) return;
        try {
            Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(assetId);
            Files.deleteIfExists(filePath);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String processUploadedFile(MultipartFile file, String existingAssetId, Boolean removeImage) {
        if (file != null && !file.isEmpty()) {
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return existingAssetId;
            }
            try {
                String originalFilename = file.getOriginalFilename();
                String ext = ".jpg";
                if (originalFilename != null && originalFilename.contains(".")) {
                    ext = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String filename = System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;

                Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(filename);
                Files.write(filePath, file.getBytes());

                // Delete old physical file if replaced
                if (existingAssetId != null && !existingAssetId.trim().isEmpty()) {
                    deletePhysicalFile(existingAssetId);
                }

                return filename;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if (Boolean.TRUE.equals(removeImage)) {
            if (existingAssetId != null && !existingAssetId.trim().isEmpty()) {
                deletePhysicalFile(existingAssetId);
            }
            return null;
        }
        return existingAssetId;
    }

    @GetMapping("/admin-panel")
    public String adminPanel(
            @RequestParam(name = "section", defaultValue = "edificios") String section,
            Model model,
            HttpSession session) {

        // Session validation check
        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }
        // Validation to prevent loading arbitrary strings
        if (!"edificios".equals(section) && !"areas-verdes".equals(section) && !"map-editor".equals(section) && !"seres-vivos".equals(section)) {
            section = "edificios";
        }

        model.addAttribute("activeSection", section);

        model.addAttribute("edificios", mapService.getEdificios());
        model.addAttribute("areasVerdes", mapService.getAreasVerdes());
        model.addAttribute("especies", mapService.getEspecies());

        return "admin_panel";
    }

    @PostMapping("/admin-panel/add-edificio")
    public String addEdificio(
            @RequestParam("nombre") String nombre,
            @RequestParam("carreras") String carreras,
            @RequestParam(value = "codigoMesh", required = false) String codigoMesh,
            @RequestParam(value = "imagen", required = false) MultipartFile imagenFile,
            @RequestParam(value = "existingAssetId", required = false) String existingAssetId,
            @RequestParam(value = "removeImage", required = false, defaultValue = "false") Boolean removeImage,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        String finalAssetId = processUploadedFile(imagenFile, existingAssetId, removeImage);

        Edificio nuevoEdificio = new Edificio(null, nombre, carreras, codigoMesh, finalAssetId);
        mapService.addEdificio(nuevoEdificio);

        return "redirect:/admin-panel?section=edificios";
    }

    @PostMapping("/admin-panel/add-area-verde")
    public String addAreaVerde(
            @RequestParam("nombre") String nombre,
            @RequestParam("sector") String sector,
            @RequestParam("superficie") Double superficie,
            @RequestParam("descripcion") String descripcion,
            @RequestParam(value = "codigoMesh", required = false) String codigoMesh,
            @RequestParam(value = "imagen", required = false) MultipartFile imagenFile,
            @RequestParam(value = "existingAssetId", required = false) String existingAssetId,
            @RequestParam(value = "removeImage", required = false, defaultValue = "false") Boolean removeImage,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        String finalAssetId = processUploadedFile(imagenFile, existingAssetId, removeImage);

        AreaVerde nuevaArea = new AreaVerde(0, nombre, sector, superficie, descripcion, codigoMesh, finalAssetId);
        mapService.addAreaVerde(nuevaArea);

        return "redirect:/admin-panel?section=areas-verdes";
    }

    @PostMapping("/admin-panel/add-especie")
    public String addEspecie(
            @RequestParam("nombre") String nombre,
            @RequestParam(value = "reino", defaultValue = "Plantae") String reino,
            @RequestParam(value = "divisionPhylum", required = false) String divisionPhylum,
            @RequestParam(value = "clase", required = false) String clase,
            @RequestParam(value = "subclase", required = false) String subclase,
            @RequestParam(value = "orden", required = false) String orden,
            @RequestParam(value = "familia", required = false) String familia,
            @RequestParam(value = "subfamilia", required = false) String subfamilia,
            @RequestParam(value = "genero", required = false) String genero,
            @RequestParam(value = "especie", required = false) String especie,
            @RequestParam(value = "variedad", required = false) String variedad,
            @RequestParam(value = "observaciones", required = false) String observaciones,
            @RequestParam(value = "imagen", required = false) MultipartFile imagenFile,
            @RequestParam(value = "existingAssetId", required = false) String existingAssetId,
            @RequestParam(value = "removeImage", required = false, defaultValue = "false") Boolean removeImage,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        String finalAssetId = processUploadedFile(imagenFile, existingAssetId, removeImage);

        Especie nuevaEspecie = new Especie(null, nombre, reino, divisionPhylum, clase, subclase, orden, familia, subfamilia, genero, especie, variedad, finalAssetId, observaciones);
        mapService.addEspecie(nuevaEspecie);

        return "redirect:/admin-panel?section=seres-vivos";
    }

    @PostMapping("/admin-panel/area-verde/add-especie")
    public String addEspecieToAreaVerde(
            @RequestParam("areaVerdeId") Integer areaVerdeId,
            @RequestParam("especieId") Integer especieId,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        mapService.addEspecieToAreaVerde(areaVerdeId, especieId);
        return "redirect:/admin-panel?section=areas-verdes";
    }

    @PostMapping("/admin-panel/area-verde/remove-especie")
    public String removeEspecieFromAreaVerde(
            @RequestParam("areaVerdeId") Integer areaVerdeId,
            @RequestParam("especieId") Integer especieId,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        mapService.removeEspecieFromAreaVerde(areaVerdeId, especieId);
        return "redirect:/admin-panel?section=areas-verdes";
    }

    @PostMapping("/admin-panel/edit-edificio")
    public String editEdificio(
            @RequestParam("id") Integer id,
            @RequestParam("nombre") String nombre,
            @RequestParam("carreras") String carreras,
            @RequestParam(value = "codigoMesh", required = false) String codigoMesh,
            @RequestParam(value = "imagen", required = false) MultipartFile imagenFile,
            @RequestParam(value = "existingAssetId", required = false) String existingAssetId,
            @RequestParam(value = "removeImage", required = false, defaultValue = "false") Boolean removeImage,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        String finalAssetId = processUploadedFile(imagenFile, existingAssetId, removeImage);

        Edificio updatedEdificio = new Edificio(id, nombre, carreras, codigoMesh, finalAssetId);
        mapService.updateEdificio(updatedEdificio);

        return "redirect:/admin-panel?section=edificios";
    }

    @PostMapping("/admin-panel/edit-area-verde")
    public String editAreaVerde(
            @RequestParam("id") Integer id,
            @RequestParam("nombre") String nombre,
            @RequestParam("sector") String sector,
            @RequestParam("superficie") Double superficie,
            @RequestParam("descripcion") String descripcion,
            @RequestParam(value = "codigoMesh", required = false) String codigoMesh,
            @RequestParam(value = "imagen", required = false) MultipartFile imagenFile,
            @RequestParam(value = "existingAssetId", required = false) String existingAssetId,
            @RequestParam(value = "removeImage", required = false, defaultValue = "false") Boolean removeImage,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        AreaVerde updatedArea = mapService.getAreaVerdeById(id);
        if (updatedArea != null) {
            String finalAssetId = processUploadedFile(imagenFile, existingAssetId != null ? existingAssetId : updatedArea.getAssetId(), removeImage);
            updatedArea.setNombre(nombre);
            updatedArea.setSector(sector);
            updatedArea.setSuperficie(superficie);
            updatedArea.setDescripcion(descripcion);
            updatedArea.setCodigoMesh(codigoMesh);
            updatedArea.setAssetId(finalAssetId);
            mapService.updateAreaVerde(updatedArea);
        }

        return "redirect:/admin-panel?section=areas-verdes";
    }

    @PostMapping("/admin-panel/edit-especie")
    public String editEspecie(
            @RequestParam("id") Integer id,
            @RequestParam("nombre") String nombre,
            @RequestParam(value = "reino", defaultValue = "Plantae") String reino,
            @RequestParam(value = "divisionPhylum", required = false) String divisionPhylum,
            @RequestParam(value = "clase", required = false) String clase,
            @RequestParam(value = "subclase", required = false) String subclase,
            @RequestParam(value = "orden", required = false) String orden,
            @RequestParam(value = "familia", required = false) String familia,
            @RequestParam(value = "subfamilia", required = false) String subfamilia,
            @RequestParam(value = "genero", required = false) String genero,
            @RequestParam(value = "especie", required = false) String especie,
            @RequestParam(value = "variedad", required = false) String variedad,
            @RequestParam(value = "observaciones", required = false) String observaciones,
            @RequestParam(value = "imagen", required = false) MultipartFile imagenFile,
            @RequestParam(value = "existingAssetId", required = false) String existingAssetId,
            @RequestParam(value = "removeImage", required = false, defaultValue = "false") Boolean removeImage,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        String finalAssetId = processUploadedFile(imagenFile, existingAssetId, removeImage);

        Especie updatedEspecie = new Especie(id, nombre, reino, divisionPhylum, clase, subclase, orden, familia, subfamilia, genero, especie, variedad, finalAssetId, observaciones);
        mapService.updateEspecie(updatedEspecie);

        return "redirect:/admin-panel?section=seres-vivos";
    }

    @PostMapping("/admin-panel/delete-edificio")
    public String deleteEdificio(@RequestParam("id") Integer id, HttpSession session) {
        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }
        Edificio ed = mapService.getEdificios().stream().filter(e -> e.getId().equals(id)).findFirst().orElse(null);
        if (ed != null && ed.getAssetId() != null) {
            deletePhysicalFile(ed.getAssetId());
        }
        mapService.deleteEdificio(id);
        return "redirect:/admin-panel?section=edificios";
    }

    @PostMapping("/admin-panel/delete-area-verde")
    public String deleteAreaVerde(@RequestParam("id") Integer id, HttpSession session) {
        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }
        AreaVerde av = mapService.getAreaVerdeById(id);
        if (av != null && av.getAssetId() != null) {
            deletePhysicalFile(av.getAssetId());
        }
        mapService.deleteAreaVerde(id);
        return "redirect:/admin-panel?section=areas-verdes";
    }

    @PostMapping("/admin-panel/delete-especie")
    public String deleteEspecie(@RequestParam("id") Integer id, HttpSession session) {
        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }
        Especie esp = mapService.getEspecies().stream().filter(e -> e.getId().equals(id)).findFirst().orElse(null);
        if (esp != null && esp.getAssetId() != null) {
            deletePhysicalFile(esp.getAssetId());
        }
        mapService.deleteEspecie(id);
        return "redirect:/admin-panel?section=seres-vivos";
    }
}
