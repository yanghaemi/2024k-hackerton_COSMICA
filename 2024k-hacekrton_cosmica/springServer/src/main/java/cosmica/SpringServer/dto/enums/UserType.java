package cosmica.SpringServer.dto.enums;

import lombok.Getter;

@Getter
public enum UserType {
    WHEELCHAIR("휠체어 이용자"),
    COMPANION("동행자");

    private final String type;
    private UserType(String type){
        this.type = type;
    }

}
