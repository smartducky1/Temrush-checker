# TEMRUSH Checker

Assets are in /assets (bg.jpg, eligible.jpg, not-eligible.jpg). Popup write-ups are at the top of script.js.

## Google Sheet
Wallets in column A. Share: "Anyone with the link" -> Viewer.
SHEET_ID = 1EyFYujfcu8SSt6epPFnMdwrhG9CJEkteGj1v5BkQHbo

## Google API key
1. console.cloud.google.com -> create/select a project.
2. APIs & Services -> Library -> enable "Google Sheets API".
3. Credentials -> Create credentials -> API key (restrict it to Google Sheets API).

## Deploy
1. Push this folder to a GitHub repo.
2. vercel.com -> Add New Project -> import the repo (no build settings).
3. Environment Variables: SHEET_ID, GOOGLE_API_KEY, SHEET_RANGE (Sheet1!A:A - use your actual tab name).
4. Deploy. New wallets in the sheet become eligible within ~30 seconds.
