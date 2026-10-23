---
name: free-stock-images
description: >-
  Searches, curates, and downloads authentic, high-resolution, free stock photographs
  and public domain images from verified repositories (Wikimedia Commons, Openverse,
  Unsplash Image CDN) instead of synthetic AI-generated images. Use this skill whenever
  the user requests real photography, authentic human portraits, non-AI images,
  unbranded macro photography, or images without English labels/watermarks.
---

# Free Stock Images Skill

This skill provides procedures and utilities for sourcing authentic, real-world, high-resolution stock photography without artificial AI artifacts, plastic skin smoothing, or unwanted foreign text/labels.

## Core Principles

1. **Authenticity Over AI**:
   - Prioritize genuine human photographs with real skin texture, natural environmental lighting, and photographic imperfections over AI-generated images that often exhibit synthetic plastic sheen or unnatural anatomical features.
2. **Contextual Purity**:
   - When sourcing editorial or health/wellness images (e.g. natural supplements, spoons, oils), avoid bottles with English brand names or labels unless explicitly requested in Portuguese.
3. **No Unintentional Duplication**:
   - Never repeat the same image across different sections of a funnel (e.g. between an interactive quiz assessment and an editorial Sales Letter).
4. **Resolution Standards**:
   - All downloaded photography must have a minimum width of 1000px and clean aspect ratios suitable for modern web presentation.

---

## Tool Usage & Fetching Workflow

### Executable Helper Script

The skill includes a dedicated Python fetcher:
- Path: `scripts/fetch_stock.py`

#### Commands:

1. **Search & Fetch from Wikimedia Commons / Openverse**:
   ```bash
   python scripts/fetch_stock.py --query "elderly man headache pain" --dest ./assets/idoso_dor.jpg --min-width 1000
   ```

2. **Fetch from Unsplash CDN via Direct Photo ID**:
   ```bash
   python scripts/fetch_stock.py --unsplash-id 1758691030894-b8d6fda73d38 --dest ./assets/idoso_dor_cronica_real.jpg --min-width 1000
   ```

3. **Macro / Object Searches (Spoons, Seeds, Natural Elements)**:
   ```bash
   python scripts/fetch_stock.py --query "flaxseed on spoon" --dest ./assets/colher_sementes.jpg --min-width 1000
   ```

---

## Verification Checklist

Before deploying any fetched image into production:
1. Verify image resolution using Python PIL (`img.size >= (1000, ...)`)
2. Inspect visually using `view_file` to ensure zero watermarks, readable non-Portuguese labels, or plastic AI artifacts.
3. Ensure image styling in CSS maintains editorial proportions (`border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.06); margin: 28px 0 32px;`).
