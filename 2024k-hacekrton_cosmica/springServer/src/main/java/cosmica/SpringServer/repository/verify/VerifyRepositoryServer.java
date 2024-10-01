package cosmica.SpringServer.repository.verify;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Repository
@Slf4j
@RequiredArgsConstructor
public class VerifyRepositoryServer implements VerifyRepository {

    @Override
    public Path upload(MultipartFile file) throws IOException {
        String uploadDir = Paths.get(System.getProperty("user.dir"), "SpringServer/src/main/resources/static/VerifyFiles").toString();
        Path path = Paths.get(uploadDir, file.getOriginalFilename());

        // 파일 저장
        Files.createDirectories(path.getParent()); // 디렉토리 생성
        Files.write(path, file.getBytes());        // 파일 저장
        return path;
    }
}
