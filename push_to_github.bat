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
echo [1/4] Checking Git repository initialization...
git status >nul 2>&1
if %errorlevel% neq 0 (
    git init
    git branch -M main
)

echo [2/4] Staging project files...
git add .

echo [3/4] Creating commit...
git commit -m "Deploy Societal Innovation Collaboration Portal frontend"

echo [4/4] Adding remote origin and pushing to GitHub...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git push -u origin main --force

echo.
echo ====================================================================
echo [SUCCESS] Code successfully pushed to GitHub!
echo.
echo Next Steps for Live Online Access on iPad / Mobile / PC:
echo 1. Go to your GitHub Repository settings -> Pages
echo 2. Set Source: Deploy from a branch -> Branch: main -> / (root) or /dist
echo 3. Or deploy to Vercel in 1 click: https://vercel.com/new
echo ====================================================================
pause
