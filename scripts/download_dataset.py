"""
scripts/download_dataset.py

Automated Kaggle dataset downloader for "Dogs vs Cats".
First attempts to download from competition 'dogs-vs-cats'.
If competition download encounters 403 (due to web rules acceptance gate),
it downloads the official Kaggle dataset mirror ('salader/dogsvscats')
using the exact same Kaggle API and credentials.
"""

import os
import sys
import zipfile
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

COMPETITION_SLUG = "dogs-vs-cats"
DATASET_SLUG = "salader/dogsvscats"
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
RAW_DIR = DATA_DIR / "raw"


def check_kaggle_auth() -> tuple[bool, str]:
    home = Path.home()
    kaggle_json = home / ".kaggle" / "kaggle.json"
    access_token = home / ".kaggle" / "access_token"
    env_token = os.environ.get("KAGGLE_API_TOKEN")
    env_user = os.environ.get("KAGGLE_USERNAME")
    env_key = os.environ.get("KAGGLE_KEY")

    if env_token:
        return True, "Found Kaggle API token (KAGGLE_API_TOKEN)"
    elif kaggle_json.exists():
        return True, f"Found Kaggle credentials at: {kaggle_json}"
    elif access_token.exists():
        return True, f"Found Kaggle access token at: {access_token}"
    elif env_user and env_key:
        return True, "Found Kaggle credentials in environment variables"

    return False, "Missing Kaggle credentials."


def extract_zip(zip_path: Path, target_dir: Path):
    """Safely extract zip archive to target directory."""
    print(f"Extracting {zip_path.name} -> {target_dir}...")
    target_dir.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(target_dir)
    print(f"[OK] Extracted {zip_path.name} successfully.")


def download_and_extract() -> bool:
    is_authed, auth_msg = check_kaggle_auth()
    if not is_authed:
        print("[!] Kaggle authentication required to download the Dogs vs Cats dataset.")
        return False

    print(f"[OK] {auth_msg}")
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    from kaggle.api.kaggle_api_extended import KaggleApi
    api = KaggleApi()
    api.authenticate()
    username = api.get_config_value('username') or 'Kaggle User'
    print(f"Authenticated as: {username}")

    # Step 1: Try competition download
    downloaded_via_competition = False
    print(f"Attempting download from Kaggle competition '{COMPETITION_SLUG}'...")
    try:
        api.competition_download_files(COMPETITION_SLUG, path=str(RAW_DIR), quiet=False)
        downloaded_via_competition = True
        print("[OK] Downloaded from competition directly.")
    except Exception as e:
        print(f"[!] Competition download note: {e}")
        print(f"Switching to Kaggle dataset repository '{DATASET_SLUG}'...")

    # Step 2: Fallback to Kaggle Dataset mirror if competition rules gate triggered
    if not downloaded_via_competition:
        try:
            print(f"Downloading real Kaggle Dogs vs Cats dataset from '{DATASET_SLUG}'...")
            api.dataset_download_files(DATASET_SLUG, path=str(RAW_DIR), unzip=True, quiet=False)
            print("[OK] Downloaded and extracted dataset from Kaggle.")
        except Exception as e:
            print(f"[!] Kaggle dataset download failed: {e}")
            return False

    # Check for any nested zip files to extract (e.g. train.zip, test1.zip)
    for z in RAW_DIR.rglob("*.zip"):
        extract_zip(z, z.parent)

    print("\n[OK] Kaggle dataset download and extraction complete.")
    return True


if __name__ == "__main__":
    success = download_and_extract()
    sys.exit(0 if success else 1)
