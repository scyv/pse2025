package com.example.time;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TimeController {

	private final AtomicLong counter = new AtomicLong();

	@GetMapping("/time")
	public Time greeting(@RequestParam(value = "name", defaultValue = "World") String name) {
		return new Time(counter.incrementAndGet(), LocalDateTime.now().toString());
	}

    public record Time(long id, String content) { }
}