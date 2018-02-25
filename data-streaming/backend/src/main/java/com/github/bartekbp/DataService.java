package com.github.bartekbp;

import com.github.javafaker.Faker;
import io.reactivex.Observable;
import lombok.extern.slf4j.Slf4j;
import me.tongfei.progressbar.ProgressBar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import javax.annotation.PostConstruct;
import java.util.List;

@Service
@Slf4j
public class DataService {
    @Autowired
    private DataMapper mapper;

    private final int KEEP_MIN_DATE = 1_000_000;

    @Autowired
    private PlatformTransactionManager txManager;
    @Autowired
    private ThreadPooledObservableCursor threadPooledObservableCursor;
    @Autowired
    private ObservableCursor observableCursor;

    @Transactional
    public List<Data> selectAll(int limit) {
        return mapper.selectAll(limit);
    }

    @PostConstruct
    public void init() {
        int countAll = mapper.countAll();
        int toInsert = KEEP_MIN_DATE - countAll;
        Faker faker = new Faker();
        log.info("Need to generate {} of data", toInsert);
        ProgressBar pb = new ProgressBar("Inserting initial data", toInsert);
        pb.start();

        DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        TransactionStatus status = txManager.getTransaction(def);

        try {
            for (int i = 0; i < toInsert; i++) {
                Data data = new Data();
                data.setFirstName(faker.name().firstName());
                data.setLastName(faker.name().lastName());
                data.setJob(faker.job().title());
                data.setPhoneNumber(faker.phoneNumber().phoneNumber());
                data.setEmail(faker.internet().emailAddress());
                data.setCountry(faker.address().country());

                mapper.insert(data);

                pb.step();
            }

        } catch (Exception e) {
            txManager.rollback(status);
            throw e;
        } finally {
            pb.stop();
        }

        txManager.commit(status);
    }

    public Observable<Data> selectAllObsInNewThreaded(int limit) {
        return threadPooledObservableCursor.observable(() -> mapper.selectAllObs(limit));
    }

    public Observable<Data> selectAllObs(int limit) {
        return observableCursor.observable(() -> mapper.selectAllObs(limit));
    }
}
