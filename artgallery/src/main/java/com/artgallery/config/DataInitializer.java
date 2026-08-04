package com.artgallery.config;

import com.artgallery.entity.Role;
import com.artgallery.enums.RoleName;
import com.artgallery.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepo;

    @Override
    public void run(String... args) {

        if (roleRepo.count() == 0) {

            Role admin = new Role();
            admin.setName(RoleName.ROLE_ADMIN);

            Role artist = new Role();
            artist.setName(RoleName.ROLE_ARTIST);

            Role customer = new Role();
            customer.setName(RoleName.ROLE_CUSTOMER);

            roleRepo.save(admin);
            roleRepo.save(artist);
            roleRepo.save(customer);
        }
    }
}