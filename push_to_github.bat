@echo off
echo ====================================================================
echo Societal Innovation Collaboration Portal - GitHub Push Helper
echo ====================================================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g., https://github.com/YOUR_USERNAME/societal-portal.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] Repository URL cannot be empty. Exiting.
    pause
    exit /b 1
)

echo.
echo [1/4] Checking Git repository status...
git status >nul 2>&1
if %errorlevel% neq 0 (
    git init
    git branch -M main
)

echo [2/4] Staging files including dist folder...
git add .

echo [3/4] Creating commit...
git commit -m "Deploy portal with pre-built dist for GitHack & GitHub Pages"

echo [4/4] Pushing to GitHub...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git push -u origin main --force

echo.
echo ====================================================================
echo [SUCCESS] Code pushed to GitHub!
echo.
echo INSTANT GITHACK LINK FOR IPAD / MOBILE / PC:
echo Open this URL in any browser:
echo https://raw.githack.com/YOUR_USERNAME/YOUR_REPO_NAME/main/dist/index.html
echo ====================================================================
pause
