package com.urambank.uram;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.urambank.uram.repository")
public class UramApplication {

	public static void main(String[] args) {
		SpringApplication.run(UramApplication.class, args);
	}

}
