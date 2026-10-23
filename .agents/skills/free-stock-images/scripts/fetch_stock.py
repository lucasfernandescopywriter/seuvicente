#!/usr/bin/env python3
"""
fetch_stock.py - Free Stock Image Fetcher for Antigravity

Fetches authentic, high-resolution, free/CC/public-domain stock photographs
from verified sources (Wikimedia Commons, Openverse, Unsplash Image CDN).
"""

import sys
import os
import argparse
import urllib.request
import urllib.parse
import json
import io

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AntigravityStockFetcher/1.0"


def search_wikimedia(query, min_width=800, limit=10):
    """Search Wikimedia Commons for high-resolution authentic photographs."""
    url = (
        f"https://commons.wikimedia.org/w/api.php?action=query&generator=search"
        f"&gsrsearch={urllib.parse.quote(query)}"
        f"&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&format=json"
    )
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            results = []
            for pid, p in pages.items():
                infos = p.get("imageinfo", [])
                if not infos:
                    continue
                info = infos[0]
                mime = info.get("mime", "")
                width = info.get("width", 0)
                height = info.get("height", 0)
                img_url = info.get("url", "")
                
                # Filter for photographic bitmaps
                if mime in ["image/jpeg", "image/png", "image/webp"] and width >= min_width:
                    if not any(bad in img_url.lower() for bad in [".pdf", ".svg", ".tif", ".gif", "icon", "logo", "map"]):
                        results.append({
                            "title": p.get("title", ""),
                            "url": img_url,
                            "width": width,
                            "height": height,
                            "source": "Wikimedia Commons"
                        })
            return results
    except Exception as e:
        print(f"[Wikimedia Error] {e}", file=sys.stderr)
        return []


def search_openverse(query, min_width=800, limit=10):
    """Search Openverse (WordPress Foundation) for free CC images."""
    url = f"https://api.openverse.org/v1/images/?q={urllib.parse.quote(query)}&page_size={limit}&license_type=commercial,modification"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            results = []
            for item in data.get("results", []):
                width = item.get("width", 0) or 0
                height = item.get("height", 0) or 0
                img_url = item.get("url", "")
                if (width == 0 or width >= min_width) and img_url:
                    results.append({
                        "title": item.get("title", ""),
                        "url": img_url,
                        "width": width,
                        "height": height,
                        "source": "Openverse"
                    })
            return results
    except Exception as e:
        return []


def download_image(img_url, dest_path, min_width=800):
    """Download and validate image."""
    os.makedirs(os.path.dirname(os.path.abspath(dest_path)), exist_ok=True)
    req = urllib.request.Request(img_url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = resp.read()

    if HAS_PIL:
        img = Image.open(io.BytesIO(data))
        if img.width < min_width and min_width > 0:
            raise ValueError(f"Image width {img.width}px is less than required {min_width}px")
        
        with open(dest_path, "wb") as f:
            f.write(data)
        return img.width, img.height, img.format
    else:
        with open(dest_path, "wb") as f:
            f.write(data)
        return 0, 0, "UNKNOWN"


def main():
    parser = argparse.ArgumentParser(description="Fetch authentic free stock photography.")
    parser.add_argument("--query", "-q", default=None, help="Search terms (e.g. 'elderly man headache')")
    parser.add_argument("--dest", "-d", required=True, help="Destination path to save the image")
    parser.add_argument("--min-width", "-w", type=int, default=800, help="Minimum width in pixels")
    parser.add_argument("--source", "-s", default="auto", choices=["auto", "wikimedia", "openverse", "direct-unsplash"])
    parser.add_argument("--unsplash-id", help="Direct Unsplash photo ID to fetch via CDN")
    args = parser.parse_args()

    if args.unsplash_id:
        url = f"https://images.unsplash.com/photo-{args.unsplash_id}?auto=format&fit=crop&w=1200&q=80"
        print(f"[*] Downloading Unsplash CDN image: {url}")
        w, h, fmt = download_image(url, args.dest, min_width=args.min_width)
        print(f"[+] Successfully saved {fmt} ({w}x{h}) to {args.dest}")
        return

    if not args.query:
        print("[-] Either --query or --unsplash-id is required.", file=sys.stderr)
        sys.exit(1)

    print(f"[*] Searching for: '{args.query}' (min-width: {args.min_width}px)...")

    results = []
    if args.source in ["auto", "wikimedia"]:
        results.extend(search_wikimedia(args.query, min_width=args.min_width))

    if not results and args.source in ["auto", "openverse"]:
        results.extend(search_openverse(args.query, min_width=args.min_width))

    if not results:
        print("[-] No matching images found with the specified parameters.", file=sys.stderr)
        sys.exit(1)

    print(f"[+] Found {len(results)} potential images. Downloading best match...")
    best = results[0]
    print(f"[*] Selected: '{best['title']}' ({best['width']}x{best['height']}) from {best['source']}")
    w, h, fmt = download_image(best["url"], args.dest, min_width=args.min_width)
    print(f"[+] Successfully saved {fmt} ({w}x{h}) to {args.dest}")


if __name__ == "__main__":
    main()
