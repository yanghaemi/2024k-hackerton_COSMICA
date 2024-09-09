package cosmica.SpringServer.service.verify;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

public interface VerifyService {
    public Path upload(MultipartFile file) throws IOException;
}
