pragma circom 2.0.0;
include "circomlib/poseidon.circom";

// JSON 데이터의 각 필드를 숫자로 인코딩했다고 가정하고, 총 13개의 입력을 받음.
// (필드 순서는 사전에 합의된 순서여야 합니다.)
template UserDataCommitment() {
    // 13개의 입력 값 (예: appState, email, aggregateVerifier, name, profileImage, typeOfLogin, verifier, verifierId, dappShare, oAuthIdToken, oAuthAccessToken, isMfaEnabled, idToken)
    signal input fields[13];
    // 출력: 모든 입력값에 대한 커밋 (해시)
    signal output commitment;

    // 13개의 입력을 이용하는 Poseidon 해시 함수 사용
    component hasher = Poseidon(13);
    for (var i = 0; i < 13; i++) {
        hasher.inputs[i] <== fields[i];
    }
    commitment <== hasher.out;
}

component main = UserDataCommitment();
