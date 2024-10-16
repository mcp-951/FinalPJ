package com.urambank.uram.entities;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "deposit_TB")
public class DepositEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int depositNo;

    @Column(nullable = false)
    private String depositName;

    @Column(nullable = false)
    private float depositRate;

    @Column(columnDefinition = "TEXT")
    private String depositContent;

    @Column(nullable = false)
    private int depositCategory;

    @Column(nullable = true)
    private String depositIMG;

    @Column(nullable = false, columnDefinition = "CHAR(1) DEFAULT 'Y'")
    private char depositState;
}
