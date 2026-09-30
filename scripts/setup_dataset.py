"""
scripts/setup_dataset.py

Validates, splits, and catalogs the Kaggle Dogs vs Cats dataset.
- Verifies images can be read without corruption.
- Detects dog/cat classes from filename prefixes or subfolders.
- Splits into balanced train/val directory structure.
- Generates real dataset_metadata.json.
"""

import os
import sys
import json
import shutil
import random
from pathlib import Path
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_FILE = PROJECT_ROOT / "dataset_metadata.json"
PUBLIC_METADATA_FILE = PROJECT_ROOT / "public" / "dataset_metadata.json"

TRAIN_SPLIT_RATIO = 0.8
SEED = 42


def get_raw_train_dir() -> Path | None:
    """Locate the directory containing dog and cat images."""
    candidates = [
        RAW_DIR / "train",
        RAW_DIR / "train" / "train",
        RAW_DIR / "catsvsdogs" / "train",
        RAW_DIR / "catsvsdogs",
        RAW_DIR
    ]
    for c in candidates:
        if c.exists() and (any(c.glob("*.jpg")) or any(c.glob("*/*.jpg"))):
            return c
    return None


def write_metadata(data: dict):
    """Save metadata to project root and public folder for frontend consumption."""
    with open(METADATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    PUBLIC_METADATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(PUBLIC_METADATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"[OK] Metadata saved to: {METADATA_FILE}")


def setup_dataset(max_samples: int | None = None) -> bool:
    if not max_samples and METADATA_FILE.exists():
        try:
            with open(METADATA_FILE, "r", encoding="utf-8") as f:
                meta = json.load(f)
            if meta.get("status") == "DATASET_READY" and (PROCESSED_DIR / "train" / "dogs").exists() and any((PROCESSED_DIR / "train" / "dogs").glob("*.jpg")):
                print(f"[OK] Processed dataset is ready ({meta.get('train_count')} train, {meta.get('validation_count')} val images). Skipping re-indexing.")
                return True
        except Exception:
            pass

    raw_train = get_raw_train_dir()

    # If raw data does not exist, attempt automated download
    if not raw_train:
        print("[!] Raw dataset directory not found. Triggering automated Kaggle downloader...")
        try:
            from scripts.download_dataset import download_and_extract
            download_success = download_and_extract()
        except ImportError:
            import download_dataset
            download_success = download_dataset.download_and_extract()

        raw_train = get_raw_train_dir()
        if not download_success or not raw_train:
            print("\n[!] Dataset setup cannot proceed without the Kaggle dataset files.")
            write_metadata({
                "connected": False,
                "status": "KAGGLE_AUTH_REQUIRED",
                "message": "Kaggle authentication required to download the Dogs vs Cats dataset.",
                "total_images": None,
                "dog_images": None,
                "cat_images": None,
                "corrupted_images": 0,
                "train_count": None,
                "validation_count": None,
                "dimensions_summary": None
            })
            return False

    print(f"[OK] Found raw image source directory: {raw_train}")

    # Discover and validate images recursively
    all_files = list(raw_train.rglob("*.jpg"))
    if not all_files:
        print(f"[!] No .jpg files found in {raw_train}")
        return False

    if max_samples and len(all_files) > max_samples:
        print(f"Limiting to first {max_samples} samples as requested...")
        all_files = all_files[:max_samples]

    print(f"Validating {len(all_files)} raw images...")

    valid_dogs = []
    valid_cats = []
    corrupted_count = 0
    widths = []
    heights = []

    for idx, img_path in enumerate(all_files):
        try:
            with Image.open(img_path) as img:
                img.verify()
            with Image.open(img_path) as img:
                w, h = img.size
                widths.append(w)
                heights.append(h)

            filename = img_path.name.lower()
            parent_dir = img_path.parent.name.lower()

            if "dog" in filename or "dog" in parent_dir:
                valid_dogs.append(img_path)
            elif "cat" in filename or "cat" in parent_dir:
                valid_cats.append(img_path)
            else:
                corrupted_count += 1
        except Exception:
            corrupted_count += 1

        if (idx + 1) % 2500 == 0:
            print(f"  Processed {idx + 1}/{len(all_files)} files...")

    total_valid = len(valid_dogs) + len(valid_cats)
    print(f"\nValidation Summary:")
    print(f"  - Total Valid: {total_valid}")
    print(f"  - Dog Images: {len(valid_dogs)}")
    print(f"  - Cat Images: {len(valid_cats)}")
    print(f"  - Corrupted / Skipped: {corrupted_count}")

    if total_valid == 0:
        print("[!] No valid dog or cat images were detected.")
        return False

    dim_summary = {
        "min_width": min(widths) if widths else 0,
        "max_width": max(widths) if widths else 0,
        "mean_width": round(sum(widths) / len(widths), 1) if widths else 0,
        "min_height": min(heights) if heights else 0,
        "max_height": max(heights) if heights else 0,
        "mean_height": round(sum(heights) / len(heights), 1) if heights else 0
    }

    random.seed(SEED)
    random.shuffle(valid_dogs)
    random.shuffle(valid_cats)

    dog_split = int(len(valid_dogs) * TRAIN_SPLIT_RATIO)
    cat_split = int(len(valid_cats) * TRAIN_SPLIT_RATIO)

    train_dogs, val_dogs = valid_dogs[:dog_split], valid_dogs[dog_split:]
    train_cats, val_cats = valid_cats[:cat_split], valid_cats[cat_split:]

    dirs = {
        "train_dogs": PROCESSED_DIR / "train" / "dogs",
        "train_cats": PROCESSED_DIR / "train" / "cats",
        "val_dogs": PROCESSED_DIR / "val" / "dogs",
        "val_cats": PROCESSED_DIR / "val" / "cats"
    }

    for d in dirs.values():
        d.mkdir(parents=True, exist_ok=True)

    def link_or_copy(files, dest_dir):
        for f in files:
            target = dest_dir / f.name
            if not target.exists():
                try:
                    os.link(f, target)
                except Exception:
                    shutil.copy2(f, target)

    print("Populating train/validation directories...")
    link_or_copy(train_dogs, dirs["train_dogs"])
    link_or_copy(train_cats, dirs["train_cats"])
    link_or_copy(val_dogs, dirs["val_dogs"])
    link_or_copy(val_cats, dirs["val_cats"])

    train_total = len(train_dogs) + len(train_cats)
    val_total = len(val_dogs) + len(val_cats)

    metadata = {
        "connected": True,
        "status": "DATASET_READY",
        "source": "Kaggle — Dogs vs Cats",
        "total_images": total_valid,
        "dog_images": len(valid_dogs),
        "cat_images": len(valid_cats),
        "corrupted_images": corrupted_count,
        "train_count": train_total,
        "validation_count": val_total,
        "split_ratio": f"{int(TRAIN_SPLIT_RATIO*100)}/{int((1-TRAIN_SPLIT_RATIO)*100)}",
        "dimensions_summary": dim_summary
    }

    write_metadata(metadata)
    print("\n[OK] Dataset setup and validation complete!")
    return True


if __name__ == "__main__":
    setup_dataset()
