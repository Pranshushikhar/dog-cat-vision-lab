"""
ml/train.py

Training pipeline for the Dog vs Cat CNN classifier.
Trains the network using real data from data/processed/, saves checkpoint weights
to models/dog_cat_cnn.keras, and plots actual training/validation accuracy and loss curves.
"""

import os
import sys
import json
import shutil
import argparse
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = PROJECT_ROOT / "models"
RESULTS_DIR = PROJECT_ROOT / "ml" / "results"
PUBLIC_DIR = PROJECT_ROOT / "public"


def plot_training_history(history, save_dir=RESULTS_DIR):
    """Generates real accuracy vs epochs and loss vs epochs charts."""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    save_dir.mkdir(parents=True, exist_ok=True)
    epochs_range = range(1, len(history.history["accuracy"]) + 1)

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5), facecolor="#07080D")

    # 1. Accuracy Plot
    ax1.set_facecolor("#11141D")
    ax1.plot(epochs_range, [acc * 100 for acc in history.history["accuracy"]], label="Training Accuracy", color="#4DA3FF", linewidth=2.5)
    if "val_accuracy" in history.history:
        ax1.plot(epochs_range, [acc * 100 for acc in history.history["val_accuracy"]], label="Validation Accuracy", color="#55E6D0", linewidth=2.5, linestyle="--")
    ax1.set_title("Model Accuracy vs Epochs", color="#F5F7FA", fontsize=12, pad=12, fontweight="bold")
    ax1.set_xlabel("Epoch", color="#A8B0BE", fontsize=10)
    ax1.set_ylabel("Accuracy (%)", color="#A8B0BE", fontsize=10)
    ax1.tick_params(colors="#A8B0BE")
    ax1.grid(True, linestyle=":", color="#FFFFFF", alpha=0.1)
    ax1.legend(facecolor="#171B25", edgecolor="none", labelcolor="#F5F7FA")

    # 2. Loss Plot
    ax2.set_facecolor("#11141D")
    ax2.plot(epochs_range, history.history["loss"], label="Training Loss", color="#6C63FF", linewidth=2.5)
    if "val_loss" in history.history:
        ax2.plot(epochs_range, history.history["val_loss"], label="Validation Loss", color="#FFA24C", linewidth=2.5, linestyle="--")
    ax2.set_title("Model Binary Cross-Entropy Loss vs Epochs", color="#F5F7FA", fontsize=12, pad=12, fontweight="bold")
    ax2.set_xlabel("Epoch", color="#A8B0BE", fontsize=10)
    ax2.set_ylabel("Loss", color="#A8B0BE", fontsize=10)
    ax2.tick_params(colors="#A8B0BE")
    ax2.grid(True, linestyle=":", color="#FFFFFF", alpha=0.1)
    ax2.legend(facecolor="#171B25", edgecolor="none", labelcolor="#F5F7FA")

    plt.tight_layout()
    chart_path = save_dir / "training_curves.png"
    plt.savefig(chart_path, dpi=200, facecolor=fig.get_facecolor(), edgecolor="none")
    plt.close()
    print(f"[OK] Training curves saved to: {chart_path}")

    # Copy to public for web rendering
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    shutil.copy2(chart_path, PUBLIC_DIR / "training_curves.png")


def train(epochs=5, batch_size=32, lr=5e-4, patience=3, steps_per_epoch=80, val_steps=25, model_type="mobilenet_v2"):
    """Main training routine."""
    import tensorflow as tf
    from ml.dataset import get_data_loaders
    from ml.model import build_dog_cat_cnn, build_mobilenet_v2_classifier, MODEL_PATH
    from ml.evaluate import evaluate_model

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 60, flush=True)
    print("STARTING REAL CNN TRAINING PIPELINE", flush=True)
    print(f"Model Type: {model_type}", flush=True)
    print(f"Target Checkpoint: {MODEL_PATH}", flush=True)
    print(f"Hyperparameters: epochs={epochs}, batch_size={batch_size}, lr={lr}", flush=True)
    if steps_per_epoch:
        print(f"Steps per epoch: {steps_per_epoch} (val steps: {val_steps})", flush=True)
    print("=" * 60, flush=True)

    train_ds, val_ds = get_data_loaders(batch_size=batch_size)

    if steps_per_epoch:
        train_ds = train_ds.repeat()
    if val_steps and val_ds:
        val_ds = val_ds.repeat()

    if model_type == "mobilenet_v2":
        model = build_mobilenet_v2_classifier(input_shape=(224, 224, 3), learning_rate=lr)
    else:
        model = build_dog_cat_cnn(input_shape=(224, 224, 3), learning_rate=lr)
    model.summary()

    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(
            filepath=str(MODEL_PATH),
            monitor="val_accuracy" if val_ds else "accuracy",
            save_best_only=True,
            verbose=1
        ),
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss" if val_ds else "loss",
            patience=patience,
            restore_best_weights=True,
            verbose=1
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss" if val_ds else "loss",
            factor=0.5,
            patience=2,
            verbose=1
        )
    ]

    print("\nTraining CNN...", flush=True)
    fit_kwargs = {
        "x": train_ds,
        "validation_data": val_ds,
        "epochs": epochs,
        "callbacks": callbacks,
        "verbose": 1
    }
    if steps_per_epoch:
        fit_kwargs["steps_per_epoch"] = steps_per_epoch
    if val_steps:
        fit_kwargs["validation_steps"] = val_steps

    history = model.fit(**fit_kwargs)

    print("\n[OK] Training complete. Generating performance visualizer charts...", flush=True)
    plot_training_history(history)

    print("\nExecuting comprehensive validation evaluation across all validation data...", flush=True)
    metrics = evaluate_model(model_path=MODEL_PATH, batch_size=batch_size)

    print("\n[OK] Full pipeline execution finished successfully.", flush=True)
    return metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Dog vs Cat CNN")
    parser.add_argument("--model-type", type=str, default="mobilenet_v2", choices=["mobilenet_v2", "baseline"], help="Model architecture")
    parser.add_argument("--epochs", type=int, default=5, help="Number of training epochs")
    parser.add_argument("--batch-size", type=int, default=32, help="Batch size")
    parser.add_argument("--lr", type=float, default=5e-4, help="Learning rate")
    parser.add_argument("--patience", type=int, default=3, help="Early stopping patience")
    parser.add_argument("--steps-per-epoch", type=int, default=80, help="Steps per training epoch (0 for full)")
    parser.add_argument("--val-steps", type=int, default=25, help="Validation steps per epoch (0 for full)")
    args = parser.parse_args()

    steps = args.steps_per_epoch if args.steps_per_epoch > 0 else None
    val_steps = args.val_steps if args.val_steps > 0 else None

    train(
        epochs=args.epochs,
        batch_size=args.batch_size,
        lr=args.lr,
        patience=args.patience,
        steps_per_epoch=steps,
        val_steps=val_steps,
        model_type=args.model_type
    )
