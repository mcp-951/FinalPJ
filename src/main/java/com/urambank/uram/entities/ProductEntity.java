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
@Table(name = "PRODUCT_TB")
public class ProductEntity {
    @Id
    @Column
    private int productNo;

    @Column
    private String productName;

    @Column
    private String productCategory;

    @Column
    private float productRate;

    @Column
    private int productPeriod;

    @Column
    private String productContent;

    @Column
    private String productIMG;


}
