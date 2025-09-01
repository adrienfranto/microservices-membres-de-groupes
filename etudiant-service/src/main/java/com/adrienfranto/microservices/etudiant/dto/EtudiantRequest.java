package com.adrienfranto.microservices.etudiant.dto;

import java.math.BigDecimal;

public record EtudiantRequest (String image,String matricule, String nom, String prenoms,String sexe, String niveau,
                               BigDecimal id_groupe){
}
