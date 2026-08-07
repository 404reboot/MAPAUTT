package controller;

import model.Animal;
import model.AreaVerde;
import model.Edificio;
import model.Plant;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
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

    private void deletePhysicalFile(String assetId) {
        if (assetId == null || assetId.trim().isEmpty()) return;
        try {
            Path srcPath = Paths.get("src/main/resources/static/images/custom/", assetId);
            Files.deleteIfExists(srcPath);
            Path targetPath = Paths.get("target/classes/static/images/custom/", assetId);
            Files.deleteIfExists(targetPath);
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

                // Save to src/main/resources/static/images/custom/
                Path srcPath = Paths.get("src/main/resources/static/images/custom/", filename);
                Files.createDirectories(srcPath.getParent());
                Files.write(srcPath, file.getBytes());

                // Copy to target/classes/static/images/custom/ if target exists
                Path targetPath = Paths.get("target/classes/static/images/custom/", filename);
                if (Files.exists(targetPath.getParent())) {
                    Files.write(targetPath, file.getBytes());
                }

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
        model.addAttribute("animales", mapService.getAnimales());
        model.addAttribute("plantas", mapService.getPlantas());

        return "admin_panel";
    }

    @PostMapping("/admin-panel/add-edificio")
    public String addEdificio(
            @RequestParam("nombre") String nombre,
            @RequestParam("carreras") String carreras,
            @RequestParam(value = "codigoMesh", required = false) String codigoMesh,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        Edificio nuevoEdificio = new Edificio(null, nombre, carreras, codigoMesh);
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
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        AreaVerde nuevaArea = new AreaVerde(0, nombre, sector, superficie, descripcion, codigoMesh);
        mapService.addAreaVerde(nuevaArea);

        return "redirect:/admin-panel?section=areas-verdes";
    }

    @PostMapping("/admin-panel/add-animal")
    public String addAnimal(
            @RequestParam("nombre") String nombre,
            @RequestParam(value = "reino", defaultValue = "Animalia") String reino,
            @RequestParam(value = "clase", required = false) String clase,
            @RequestParam(value = "subclase", required = false) String subclase,
            @RequestParam(value = "orden", required = false) String orden,
            @RequestParam(value = "familia", required = false) String familia,
            @RequestParam(value = "subfamilia", required = false) String subfamilia,
            @RequestParam(value = "genero", required = false) String genero,
            @RequestParam(value = "especie", required = false) String especie,
            @RequestParam(value = "imagen", required = false) MultipartFile imagenFile,
            @RequestParam(value = "existingAssetId", required = false) String existingAssetId,
            @RequestParam(value = "removeImage", required = false, defaultValue = "false") Boolean removeImage,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        String finalAssetId = processUploadedFile(imagenFile, existingAssetId, removeImage);

        Animal nuevoAnimal = new Animal(null, nombre, reino, clase, subclase, orden, familia, subfamilia, genero, especie, finalAssetId);
        mapService.addAnimal(nuevoAnimal);

        return "redirect:/admin-panel?section=seres-vivos";
    }

    @PostMapping("/admin-panel/add-plant")
    public String addPlant(
            @RequestParam("nombre") String nombre,
            @RequestParam(value = "reino", defaultValue = "Plantae") String reino,
            @RequestParam(value = "division", required = false) String division,
            @RequestParam(value = "clase", required = false) String clase,
            @RequestParam(value = "orden", required = false) String orden,
            @RequestParam(value = "familia", required = false) String familia,
            @RequestParam(value = "genero", required = false) String genero,
            @RequestParam(value = "especie", required = false) String especie,
            @RequestParam(value = "imagen", required = false) MultipartFile imagenFile,
            @RequestParam(value = "existingAssetId", required = false) String existingAssetId,
            @RequestParam(value = "removeImage", required = false, defaultValue = "false") Boolean removeImage,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        String finalAssetId = processUploadedFile(imagenFile, existingAssetId, removeImage);

        Plant nuevaPlanta = new Plant(null, nombre, reino, division, clase, orden, familia, genero, especie, finalAssetId);
        mapService.addPlant(nuevaPlanta);

        return "redirect:/admin-panel?section=seres-vivos";
    }

    @PostMapping("/admin-panel/edit-edificio")
    public String editEdificio(
            @RequestParam("id") Integer id,
            @RequestParam("nombre") String nombre,
            @RequestParam("carreras") String carreras,
            @RequestParam(value = "codigoMesh", required = false) String codigoMesh,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        Edificio updatedEdificio = new Edificio(id, nombre, carreras, codigoMesh);
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
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        AreaVerde updatedArea = new AreaVerde(id, nombre, sector, superficie, descripcion, codigoMesh);
        mapService.updateAreaVerde(updatedArea);

        return "redirect:/admin-panel?section=areas-verdes";
    }

    @PostMapping("/admin-panel/edit-animal")
    public String editAnimal(
            @RequestParam("id") Integer id,
            @RequestParam("nombre") String nombre,
            @RequestParam(value = "reino", defaultValue = "Animalia") String reino,
            @RequestParam(value = "clase", required = false) String clase,
            @RequestParam(value = "subclase", required = false) String subclase,
            @RequestParam(value = "orden", required = false) String orden,
            @RequestParam(value = "familia", required = false) String familia,
            @RequestParam(value = "subfamilia", required = false) String subfamilia,
            @RequestParam(value = "genero", required = false) String genero,
            @RequestParam(value = "especie", required = false) String especie,
            @RequestParam(value = "imagen", required = false) MultipartFile imagenFile,
            @RequestParam(value = "existingAssetId", required = false) String existingAssetId,
            @RequestParam(value = "removeImage", required = false, defaultValue = "false") Boolean removeImage,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        String finalAssetId = processUploadedFile(imagenFile, existingAssetId, removeImage);

        Animal updatedAnimal = new Animal(id, nombre, reino, clase, subclase, orden, familia, subfamilia, genero, especie, finalAssetId);
        mapService.updateAnimal(updatedAnimal);

        return "redirect:/admin-panel?section=seres-vivos";
    }

    @PostMapping("/admin-panel/edit-plant")
    public String editPlant(
            @RequestParam("id") Integer id,
            @RequestParam("nombre") String nombre,
            @RequestParam(value = "reino", defaultValue = "Plantae") String reino,
            @RequestParam(value = "division", required = false) String division,
            @RequestParam(value = "clase", required = false) String clase,
            @RequestParam(value = "orden", required = false) String orden,
            @RequestParam(value = "familia", required = false) String familia,
            @RequestParam(value = "genero", required = false) String genero,
            @RequestParam(value = "especie", required = false) String especie,
            @RequestParam(value = "imagen", required = false) MultipartFile imagenFile,
            @RequestParam(value = "existingAssetId", required = false) String existingAssetId,
            @RequestParam(value = "removeImage", required = false, defaultValue = "false") Boolean removeImage,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        String finalAssetId = processUploadedFile(imagenFile, existingAssetId, removeImage);

        Plant updatedPlant = new Plant(id, nombre, reino, division, clase, orden, familia, genero, especie, finalAssetId);
        mapService.updatePlant(updatedPlant);

        return "redirect:/admin-panel?section=seres-vivos";
    }

    @PostMapping("/admin-panel/delete-edificio")
    public String deleteEdificio(@RequestParam("id") Integer id, HttpSession session) {
        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }
        mapService.deleteEdificio(id);
        return "redirect:/admin-panel?section=edificios";
    }

    @PostMapping("/admin-panel/delete-area-verde")
    public String deleteAreaVerde(@RequestParam("id") Integer id, HttpSession session) {
        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }
        mapService.deleteAreaVerde(id);
        return "redirect:/admin-panel?section=areas-verdes";
    }

    @PostMapping("/admin-panel/delete-animal")
    public String deleteAnimal(@RequestParam("id") Integer id, HttpSession session) {
        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }
        Animal animal = mapService.getAnimales().stream().filter(a -> a.getId().equals(id)).findFirst().orElse(null);
        if (animal != null && animal.getAssetId() != null) {
            deletePhysicalFile(animal.getAssetId());
        }
        mapService.deleteAnimal(id);
        return "redirect:/admin-panel?section=seres-vivos";
    }

    @PostMapping("/admin-panel/delete-plant")
    public String deletePlant(@RequestParam("id") Integer id, HttpSession session) {
        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }
        Plant plant = mapService.getPlantas().stream().filter(p -> p.getId().equals(id)).findFirst().orElse(null);
        if (plant != null && plant.getAssetId() != null) {
            deletePhysicalFile(plant.getAssetId());
        }
        mapService.deletePlant(id);
        return "redirect:/admin-panel?section=seres-vivos";
    }
}


