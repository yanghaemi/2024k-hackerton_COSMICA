package cosmica.SpringServer.service.verify;

import cosmica.SpringServer.repository.verify.VerifyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

@Service
@RequiredArgsConstructor
public class VerifyServiceImpl implements VerifyService {

    private final VerifyRepository verifyRepository;

    @Override
    public Path upload(MultipartFile file) throws IOException {
        return verifyRepository.upload(file);
    }
}
