package com.example.productcatalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableCaching
@EnableScheduling
@SpringBootApplication
public class ProductCatalogApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductCatalogApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.boot.CommandLineRunner commandLineRunner(javax.sql.DataSource dataSource) {
		return args -> {
			System.out.println("DATASOURCE URL: " + dataSource.getConnection().getMetaData().getURL());
			System.out.println("DATASOURCE USER: " + dataSource.getConnection().getMetaData().getUserName());
		};
	}

}
