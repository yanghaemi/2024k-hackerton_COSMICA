package cosmica.SpringServer.enums;

import lombok.Getter;

//User가 휠체어 이용자인지, 동행자인지 구분 타입.
@Getter
public enum UserType {
    WHEELCHAIR("휠체어 이용자"),
    COMPANION("동행자");

    private final String type;
    private UserType(String type){
        this.type = type;
    }

}
