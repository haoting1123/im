package com.synto;

import com.synto.core.application.SyntoRestApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@EnableJpaRepositories(basePackages={"com.synto"})
@SpringBootApplication
public
class ImApplication extends SyntoRestApplication implements CommandLineRunner {

  public static void main(String[] args) {
    SpringApplication.run(ImApplication.class, args);
  }

  @Override
  public void run(String... args) throws Exception {

  }
}
