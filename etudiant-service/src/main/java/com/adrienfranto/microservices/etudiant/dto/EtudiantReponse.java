package com.adrienfranto.microservices.etudiant.dto;

import java.math.BigDecimal;

public record EtudiantReponse(String id,String image, String matricule, String nom, String prenoms, String sexe,String niveau,
                              BigDecimal id_groupe) {
}
