package com.urambank.uram.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "O_ACCOUNT_TB")
public class OutAccountEntity {
    @Id
    @Column
    private int oAccountNo;

    @Column
    private int oAccountNumber;

    @Column
    private String oUserName;

    @Column
    private String oAccountState;

    @Column
    private String oBankName;
}
