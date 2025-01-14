package com.kk.cibaria.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "File")
@Data
@NoArgsConstructor
public class FileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Lob
    @Column(name = "file", columnDefinition = "LONGBLOB")
    private byte[] file;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "recipe_id")
    @JsonBackReference
    private Recipe recipe;

}
