plugins {
    id("checkstyle")
    id("java-library-distribution")
}

group = "LoanManagementSystem"
version = "1.0"

repositories {
    mavenCentral()
    maven {
        url = uri("https://hyperledger.jfrog.io/hyperledger/fabric-maven")
    }
    maven {
        url = uri("https://jitpack.io")
    }
}

dependencies {
    compileOnly("org.hyperledger.fabric-chaincode-java:fabric-chaincode-shim:2.2.+")
    implementation("com.owlike:genson:1.5")
    api("org.apache.commons:commons-math3:3.6.1")
    implementation("com.google.guava:guava:28.2-jre")
    testImplementation("junit:junit:4.12")
}
