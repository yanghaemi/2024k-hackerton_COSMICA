package cosmica.SpringServer.repository.verify;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

public interface VerifyRepository {
    public Path upload(MultipartFile file) throws IOException;
}
