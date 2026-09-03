# NSSE Boys Okara — Admission Test Roll Number Slip

This is your template, rebuilt so the data lives in **results.xlsx** instead
of being hard-coded — you never edit HTML/JS again, just the spreadsheet.
All 561 students from your original file are already loaded in.

## Put it on GitHub Pages (one-time setup)

1. Create a new **public** repository on GitHub (e.g. `nsse-okara-slips`).
2. **Add file → Upload files**, drag in all 5 files: `index.html`, `styles.css`, `app.js`, `xlsx.full.min.js`, `logo.png`, `results.xlsx`. Commit.
3. Go to **Settings → Pages** → Source: **Deploy from a branch** → branch **main**, folder **/ (root)** → Save.
4. Wait ~1 minute, refresh — your live URL appears at the top.

## Updating student records

Open **results.xlsx** — 3 tabs:

- **Settings** — school name, subtitle, tagline, phone. Edit the *Value* column.
- **Schedule** — the green "Admission Test Schedule" box at the top. One row per class group.
- **Students** — one row per child: Roll, RegNo, Name, Class, Mobile, FatherName, BForm, ExamDate, Shift, ClassGroup.

Edit, save, re-upload to GitHub (replace the existing file), and the site updates within a minute or two. There's also an **Instructions** tab inside the workbook with the same guidance.

Roll numbers reset per class group (e.g. there are three different "Roll 1"s — one per ECE/Nursery, Prep/KG, Class One), matching your original file. Search is always by B-Form number, which is unique per child.

## Running it locally to preview changes

`index.html` opened directly (double-click) won't load the Excel data — browsers block that. Instead, from inside the folder:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`. This is only needed for previewing on your own computer — it works normally once live on GitHub Pages.

## Customizing further

- **Colors / fonts**: the `:root` block at the top of `styles.css`.
- **Logo**: replace `logo.png` with a same-named file (any reasonable size, square works best).
- **Rules list on the slip**: the `<ul>` inside `.rules-box` in `index.html`.

## Privacy note

This is a static, unauthenticated page — anyone with the link can look up any B-Form number. That matches your original file's behavior. Don't add anything more sensitive than what's already here (name, class, father's name, mobile, B-Form) into `results.xlsx`.
