"""
run_pipeline.py

One-command pipeline orchestrator:
1. Dataset validation & processing
2. CNN Model Training
3. Validation Evaluation & Metrics Calculation
4. Visual Training Charts Generation
5. Checkpoint & Artifact Saving
"""

import sys
import argparse
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(PROJECT_ROOT))


def run_pipeline(epochs=5, batch_size=32, lr=5e-4, steps_per_epoch=80, val_steps=25, max_samples=None, model_type="mobilenet_v2"):
    print("=" * 80, flush=True)
    print("      DOG vs CAT CNN MACHINE LEARNING PIPELINE", flush=True)
    print("=" * 80, flush=True)

    # 1. Dataset Setup & Validation
    print("\n[STEP 1/3] Dataset Validation & Preprocessing...", flush=True)
    from scripts.setup_dataset import setup_dataset
    dataset_ready = setup_dataset(max_samples=max_samples)

    if not dataset_ready:
        print("\n" + "=" * 80, flush=True)
        print("[!] Pipeline halted at Step 1: Dataset is not ready.", flush=True)
        print("    If Kaggle authentication is needed, please follow the instructions above.", flush=True)
        print("=" * 80, flush=True)
        return False

    # 2. CNN Training & Chart Generation
    print("\n[STEP 2/3] Convolutional Neural Network Training...", flush=True)
    from ml.train import train
    try:
        metrics = train(
            epochs=epochs,
            batch_size=batch_size,
            lr=lr,
            steps_per_epoch=steps_per_epoch,
            val_steps=val_steps,
            model_type=model_type
        )
    except Exception as e:
        print(f"\n[!] Training encountered an error: {e}", flush=True)
        import traceback
        traceback.print_exc()
        return False

    # 3. Final Summary
    print("\n[STEP 3/3] Finalizing Artifacts & Metrics...", flush=True)
    print("=" * 80, flush=True)
    print("PIPELINE COMPLETED SUCCESSFULLY!", flush=True)
    print(f"  Accuracy:  {metrics.get('accuracy')}%", flush=True)
    print(f"  Precision: {metrics.get('precision')}%", flush=True)
    print(f"  Recall:    {metrics.get('recall')}%", flush=True)
    print(f"  F1 Score:  {metrics.get('f1_score')}%", flush=True)
    print("Artifacts generated:", flush=True)
    print("  - Model:   models/dog_cat_cnn.keras", flush=True)
    print("  - Metrics: ml/results/metrics.json & public/metrics.json", flush=True)
    print("  - Curves:  ml/results/training_curves.png & public/training_curves.png", flush=True)
    print("  - Matrix:  ml/results/confusion_matrix.png & public/confusion_matrix.png", flush=True)
    print("=" * 80, flush=True)
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run complete Dog vs Cat ML Pipeline")
    parser.add_argument("--model-type", type=str, default="mobilenet_v2", choices=["mobilenet_v2", "baseline"], help="Model architecture")
    parser.add_argument("--epochs", type=int, default=5, help="Number of training epochs")
    parser.add_argument("--batch-size", type=int, default=32, help="Batch size")
    parser.add_argument("--lr", type=float, default=5e-4, help="Learning rate")
    parser.add_argument("--steps-per-epoch", type=int, default=80, help="Steps per training epoch (0 for full)")
    parser.add_argument("--val-steps", type=int, default=25, help="Validation steps per epoch (0 for full)")
    parser.add_argument("--max-samples", type=int, default=None, help="Cap dataset samples (e.g. for quick smoke tests)")
    args = parser.parse_args()

    steps = args.steps_per_epoch if args.steps_per_epoch > 0 else None
    val_steps = args.val_steps if args.val_steps > 0 else None

    success = run_pipeline(
        epochs=args.epochs,
        batch_size=args.batch_size,
        lr=args.lr,
        steps_per_epoch=steps,
        val_steps=val_steps,
        max_samples=args.max_samples,
        model_type=args.model_type
    )
    sys.exit(0 if success else 1)
