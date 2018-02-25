package com.github.bartekbp;

import io.reactivex.Observable;
import org.apache.ibatis.cursor.Cursor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

@Component
public class ObservableCursor {
    @Autowired
    private PlatformTransactionManager txManager;

    public Observable<Data> observable(Supplier<Cursor<Data>> supplier) {
        return Observable.fromPublisher(subscriber -> {
            DefaultTransactionDefinition def = new DefaultTransactionDefinition();
            def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
            TransactionStatus status = txManager.getTransaction(def);

            try {
                supplier.get().forEach(subscriber::onNext);
                txManager.commit(status);
                subscriber.onComplete();
            } catch (Exception e) {
                txManager.rollback(status);
                subscriber.onError(e);
            }
        });
    }
}
