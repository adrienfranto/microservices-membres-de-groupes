package com.adrienfranto.microservices.etudiant.controller;

import com.adrienfranto.microservices.etudiant.dto.EtudiantReponse;
import com.adrienfranto.microservices.etudiant.dto.EtudiantRequest;
import com.adrienfranto.microservices.etudiant.service.EtudiantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/etudiants")
@RequiredArgsConstructor
public class EtudiantController {

    private final EtudiantService etudiantService;

    @PostMapping
    public ResponseEntity<EtudiantReponse> ajouterEtudiant(@RequestBody EtudiantRequest etudiantRequest) {
        return ResponseEntity.ok(etudiantService.ajouterEtudiant(etudiantRequest));
    }

    @GetMapping
    public ResponseEntity<List<EtudiantReponse>> afficherEtudiants() {
        return ResponseEntity.ok(etudiantService.afficherEtudiants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EtudiantReponse> afficherEtudiantParId(@PathVariable String id) {
        return etudiantService.afficherEtudiantParId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EtudiantReponse> modifierEtudiant(@PathVariable String id,
                                                            @RequestBody EtudiantRequest etudiantRequest) {
        return etudiantService.modifierEtudiant(id, etudiantRequest)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerEtudiant(@PathVariable String id) {
        if(etudiantService.supprimerEtudiant(id)){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
