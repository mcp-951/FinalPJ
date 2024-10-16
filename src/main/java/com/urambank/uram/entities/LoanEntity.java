package com.urambank.uram.entities;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "Loan_TB")
public class LoanEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int loanNo;

    @Column(nullable = false)
    private String loanName;

    @Column(nullable = false)
    private float loanRate;

    @Column(columnDefinition = "TEXT")
    private String loanContent;

    @Column(nullable = false, columnDefinition = "CHAR(1) DEFAULT 'y'")
    private Character loanState;
}
