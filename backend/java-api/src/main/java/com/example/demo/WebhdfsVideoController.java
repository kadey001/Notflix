package com.example.demo;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.fileupload.util.Streams;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.text.ParseException;

@RestController
public class WebhdfsVideoController {
    @PutMapping("/createFile")
    /* @POST
     * @Consumes(MediaType.MULTIPART_FORM_DATA)
     * @Produces(MediaType.APPLICATION_JSON)
     */
    public void createFile(HttpServletRequest request) throws Exception {
        boolean isMultipart = ServletFileUpload.isMultipartContent(request);
        WebHDFSFileUploadService service = new WebHDFSFileUploadService();
        ServletFileUpload upload = new ServletFileUpload();
        FileItemIterator iterStream = upload.getItemIterator(request);
        while (iterStream.hasNext()) {
            FileItemStream item = iterStream.next();
            String name = item.getFieldName();
            InputStream stream = item.openStream();
            if (!item.isFormField()) {
                // Process the InputStream
                String baseUrl = "http://localhost:9870/webhdfs/v1/";
                String mkdirUrl = "videos/" + name + "?op=CREATE"; // + "?user.name=" + userName + "&op=CREATE" + "&namenoderpcaddress=localhost:9870&overwrite=true";

                mkdirUrl = baseUrl + mkdirUrl;
                String output = service.uploadFile(mkdirUrl, stream);
            } else {
                String formFieldValue = Streams.asString(stream);
            }
        }
//        System.out.println("Entered into WebhdfsDemoController.createFile() controller method");
//        System.out.println(file.getOriginalFilename());
//        String output = null;
//
//        try {
//            String baseUrl = "http://localhost:9870/webhdfs/v1/";
//            String userName = "root";
//            String mkdirUrl = "videos/" + file.getOriginalFilename(); // + "?user.name=" + userName + "&op=CREATE" + "&namenoderpcaddress=localhost:9870&overwrite=true";
//
//            mkdirUrl = baseUrl + mkdirUrl;
//
//            System.out.println("createDirectory() hitting the url is: " + mkdirUrl);
//
//            WebHDFSFileUploadService service = new WebHDFSFileUploadService();
//
//            File sourceFile = null; //Write a core java logic to convert inputstream object to File object
//            try {
//                sourceFile = new File("filename.txt");
//                if (sourceFile.createNewFile()) {
//                    System.out.println("File created: " + sourceFile.getName());
//                } else {
//                    System.out.println("File already exists.");
//                }
//            } catch (IOException e) {
//                System.out.println("An error occurred.");
//                e.printStackTrace();
//            }
//            file.transferTo(sourceFile);
//            try {
//                output = service.uploadFile(mkdirUrl, sourceFile);
//            } catch (ParseException e) {
//                e.printStackTrace();
//            }
//
//            System.out.println("createFile output: " + output);
//        } catch (MalformedURLException e) {
//            e.printStackTrace();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//
//        System.out.println("Exiting from WebhdfsDemoController.createFile() controller method");
    }

}
