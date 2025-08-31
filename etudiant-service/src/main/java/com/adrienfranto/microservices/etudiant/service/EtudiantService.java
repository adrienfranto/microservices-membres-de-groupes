package com.adrienfranto.microservices.etudiant.service;

import com.adrienfranto.microservices.etudiant.dto.EtudiantReponse;
import com.adrienfranto.microservices.etudiant.dto.EtudiantRequest;
import com.adrienfranto.microservices.etudiant.model.Etudiant;
import com.adrienfranto.microservices.etudiant.repository.EtudiantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EtudiantService {
    private final EtudiantRepository etudiantRepository;

    public EtudiantReponse ajouterEtudiant(EtudiantRequest etudiantRequest){
        Etudiant etudiant =Etudiant.builder()
                .matricule(etudiantRequest.matricule())
                .nom(etudiantRequest.nom())
                .prenoms(etudiantRequest.prenoms())
                .niveau(etudiantRequest.niveau())
                .id_travail(etudiantRequest.id_travail())
                .build();

        etudiant = etudiantRepository.save(etudiant);
        log.info("Étudiant enregistré avec succès, id: " + etudiant.getId());
        return mapToResponse(etudiant);
    }

    public List<EtudiantReponse> afficherEtudiants(){
        return etudiantRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Optional<EtudiantReponse> afficherEtudiantParId(String id){
        return etudiantRepository.findById(id)
                .map(this::mapToResponse);
    }

    public Optional<EtudiantReponse> modifierEtudiant(String id, EtudiantRequest etudiantRequest){
        return etudiantRepository.findById(id).map(etudiant -> {
            etudiant.setMatricule(etudiantRequest.matricule());
            etudiant.setNom(etudiantRequest.nom());
            etudiant.setPrenoms(etudiantRequest.prenoms());
            etudiant.setNiveau(etudiantRequest.niveau());
            etudiant.setId_travail(etudiantRequest.id_travail());
            Etudiant updated = etudiantRepository.save(etudiant);
            log.info(" Étudiant modifié avec succès, id: " + updated.getId());
            return mapToResponse(updated);
        });
    }

    public boolean supprimerEtudiant(String id){
        if(etudiantRepository.existsById(id)){
            etudiantRepository.deleteById(id);
            log.info("Étudiant supprimé avec succès, id: " + id);
            return true;
        }
        return false;
    }

    private EtudiantReponse mapToResponse(Etudiant etudiant){
        return new EtudiantReponse(
                etudiant.getId(),
                etudiant.getMatricule(),
                etudiant.getNom(),
                etudiant.getPrenoms(),
                etudiant.getNiveau(),
                etudiant.getId_travail()
        );
    }
}
