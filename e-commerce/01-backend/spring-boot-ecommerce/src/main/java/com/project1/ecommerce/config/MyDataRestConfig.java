package com.project1.ecommerce.config;

import com.project1.ecommerce.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;
    @Value("${allowed.origins}")
    private String[] allowedOrigins;

    @Autowired
    MyDataRestConfig(EntityManager entityManager){
        this.entityManager=entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);

        HttpMethod unSupportedMethods[] = {HttpMethod.DELETE,HttpMethod.POST,HttpMethod.PUT,HttpMethod.PATCH};

        restrictHttpMethods(ProductCategory.class,config, unSupportedMethods);
        restrictHttpMethods(Product.class,config, unSupportedMethods);
        restrictHttpMethods(Country.class,config, unSupportedMethods);
        restrictHttpMethods(State.class,config, unSupportedMethods);
        restrictHttpMethods(Order.class,config, unSupportedMethods);

        exposeIds(config);

        cors.addMapping(config.getBasePath()+"/**").allowedOrigins(allowedOrigins);
    }

    private static void restrictHttpMethods(Class respositoryClass,RepositoryRestConfiguration config, HttpMethod[] unSupportedMethods) {
        config.getExposureConfiguration()
                .forDomainType(respositoryClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unSupportedMethods))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unSupportedMethods));
    }

    private void exposeIds(RepositoryRestConfiguration config){
        //-get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        //create an array of the entity types
        List<Class> entityClasses = new ArrayList<>();

        //get the entity types for the entities
        for(EntityType entity: entities){
            entityClasses.add(entity.getJavaType());
        }

        //expose the entity ids for the array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);

    }
}
