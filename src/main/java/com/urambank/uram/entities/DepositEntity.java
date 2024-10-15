package com.urambank.uram.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@Entity
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

    @Column(nullable = false, columnDefinition = "CHAR(1) DEFAULT 'Y'")
    private char depositState;
}
