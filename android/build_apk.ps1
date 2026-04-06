$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\amanj\AppData\Local\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"

Write-Host "Using Java: $env:JAVA_HOME"
Write-Host "Using Android SDK: $env:ANDROID_HOME"

# Run Gradle wrapper
& ".\gradlew.bat" assembleDebug --no-daemon --warning-mode=all
