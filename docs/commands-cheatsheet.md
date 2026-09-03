# Commands Cheatsheet

Run from:

```powershell
Set-Location 'C:\Users\yahel\Desktop\AI STUFF\cheaptruck'
```

## View Structure

```powershell
Get-ChildItem -Recurse -File | Sort-Object FullName | Select-Object FullName
```

## View Root Files

```powershell
Get-ChildItem -Force
```

## Start A Planning Task

```powershell
Get-Content -Raw .\CODEX.md
Get-Content -Raw .\<area>\CONTEXT.md
```

Replace `<area>` with `ui`, `requests`, `measurements`, `marketplace`, `room-designs`, `workflow`, `tech`, `decisions`, or `docs`.

## Find Open Work

```powershell
rg -n "To Define|Follow-up|unknown|Unknown|placeholder|TODO" .
```

## Search A Product Term

```powershell
rg -n "Marketplace|address|fit|replacement|seller|3D|price" .
```

## List Domain Contexts

```powershell
Get-ChildItem -Recurse -Filter CONTEXT.md | Sort-Object FullName | Select-Object FullName
```

## Read Current Queue

```powershell
Get-Content -Raw .\docs\next-steps.md
```

## Check Whether This Is Git

```powershell
git status
```

This workspace may be planning-only and not a Git repository.
