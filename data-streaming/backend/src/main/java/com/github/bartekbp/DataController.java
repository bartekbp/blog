package com.github.bartekbp;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SequenceWriter;
import io.jmnarloch.spring.boot.rxjava.async.ObservableSseEmitter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@RestController
public class DataController {
    @Autowired
    private DataService service;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/data")
    public List<Data> readData(@RequestParam("limit") Optional<Integer> limit) {
        return service.selectAll(limit.orElse(Integer.MAX_VALUE));
    }

    @GetMapping(value = "/dataSse", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ObservableSseEmitter<Data> readDataSSE(@RequestParam("limit") Optional<Integer> limit) {
        return new ObservableSseEmitter<>(TimeUnit.MINUTES.toMillis(5),
                MediaType.APPLICATION_JSON_UTF8,
                service.selectAllObsInNewThreaded(limit.orElse(Integer.MAX_VALUE)));
    }

    @GetMapping(value = "/dataObs", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public void readDataObs(@RequestParam("limit") Optional<Integer> limit, HttpServletResponse response) throws IOException {
        SequenceWriter writer = objectMapper.writer().writeValuesAsArray(response.getOutputStream());
        service.selectAllObs(limit.orElse(Integer.MAX_VALUE))
                .forEach(writer::write);
        writer.close();
    }
}
