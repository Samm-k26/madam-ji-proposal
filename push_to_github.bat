@echo off
title Madam Ji Proposal - GitHub Push
echo ================================================================
echo   Romantic Proposal Website - Pushing to GitHub Pages
echo ================================================================
echo.
echo Target Repository: https://github.com/Samm-k26/madam-ji-proposal.git
echo.
cd /d "C:\Users\Samyak Khobragade\.gemini\antigravity\scratch\madam-ji-proposal"
git config http.postBuffer 524288000
git config http.version HTTP/1.1
git push -u origin main --force
echo.
if %ERRORLEVEL% EQU 0 (
    echo ================================================================
    echo   [SUCCESS] All files uploaded to GitHub successfully!
    echo.
    echo   Wait 1-2 minutes for GitHub Pages to refresh, then visit:
    echo   https://samm-k26.github.io/madam-ji-proposal/
    echo ================================================================
) else (
    echo ================================================================
    echo   [FAILED] Repository not found or push blocked.
    echo   1. Ensure repository 'madam-ji-proposal' exists on https://github.com/new
    echo   2. If browser login opens, please authorize it.
    echo ================================================================
)
echo.
pause