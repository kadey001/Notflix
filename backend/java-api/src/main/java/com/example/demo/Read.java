package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController
public class Read {
    @GetMapping("/read")
    public void read() throws IOException {
        URL url = new URL("http://localhost:9870/webhdfs/v1/videos/rat.mp4");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setDoInput(true);
        InputStream in = connection.getInputStream();
        int ch;
        while ((ch = in.read()) != -1) {
            System.out.println((char) ch);
        }
    }
}
