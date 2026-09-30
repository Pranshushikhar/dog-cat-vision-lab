"""
ml/evaluate.py

Evaluates the trained CNN on the validation / test partition.
Calculates REAL:
  - Accuracy
  - Precision
  - Recall
  - F1 Score
  - Confusion Matrix
  - Validation Loss
Generates real visual evaluation charts and saves metrics to ml/results/metrics.json.
"""

import os
import json
import argparse
from pathlib import Path
import numpy as np

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = PROJECT_ROOT / "models" / "dog_cat_cnn.keras"
RESULTS_DIR = PROJECT_ROOT / "ml" / "results"
METRICS_JSON = RESULTS_DIR / "metrics.json"
PUBLIC_METRICS_JSON = PROJECT_ROOT / "public" / "metrics.json"


def evaluate_model(model_path=MODEL_PATH, batch_size=32):
    """
    Evaluates model on validation data, plots confusion matrix,
    and returns metrics dictionary.
    """
    import tensorflow as tf
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    if not Path(model_path).exists():
        raise FileNotFoundError(f"Trained model not found at {model_path}. Train the model first.")

    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    from ml.dataset import get_data_loaders

    print(f"Loading trained weights from: {model_path}...")
    model = tf.keras.models.load_model(str(model_path))

    _, val_ds = get_data_loaders(batch_size=batch_size)
    if val_ds is None:
        raise ValueError("Validation dataset not found. Run scripts/setup_dataset.py first.")

    print("Running evaluation over validation dataset...")
    y_true = []
    y_pred_probs = []

    for images, labels in val_ds:
        preds = model.predict(images, verbose=0)
        y_pred_probs.extend(preds.flatten())
        y_true.extend(labels.numpy().flatten())

    y_true = np.array(y_true)
    y_pred_probs = np.array(y_pred_probs)
    y_pred = (y_pred_probs >= 0.5).astype(int)

    acc = float(accuracy_score(y_true, y_pred))
    prec = float(precision_score(y_true, y_pred, zero_division=0))
    rec = float(recall_score(y_true, y_pred, zero_division=0))
    f1 = float(f1_score(y_true, y_pred, zero_division=0))
    cm = confusion_matrix(y_true, y_pred).tolist()

    # Calculate validation binary cross-entropy loss
    eps = 1e-7
    val_loss = float(-np.mean(y_true * np.log(y_pred_probs + eps) + (1 - y_true) * np.log(1 - y_pred_probs + eps)))

    print("\n" + "=" * 50)
    print("REAL EVALUATION METRICS:")
    print(f"  Accuracy:        {acc * 100:.2f}%")
    print(f"  Precision:       {prec * 100:.2f}%")
    print(f"  Recall:          {rec * 100:.2f}%")
    print(f"  F1 Score:        {f1 * 100:.2f}%")
    print(f"  Validation Loss: {val_loss:.4f}")
    print(f"  Confusion Matrix: {cm}")
    print("=" * 50 + "\n")

    # Plot Confusion Matrix Heatmap
    fig, ax = plt.subplots(figsize=(6, 5), facecolor="#0B0D14")
    ax.set_facecolor("#11141D")
    im = ax.imshow(cm, interpolation="nearest", cmap="Blues")

    ax.set_title("Confusion Matrix (Dogs vs Cats)", color="#F5F7FA", fontsize=12, pad=12)
    ax.set_xlabel("Predicted Label", color="#A8B0BE", fontsize=10)
    ax.set_ylabel("True Label", color="#A8B0BE", fontsize=10)
    ax.set_xticks([0, 1], labels=["Cat (0)", "Dog (1)"], color="#A8B0BE")
    ax.set_yticks([0, 1], labels=["Cat (0)", "Dog (1)"], color="#A8B0BE")

    for i in range(2):
        for j in range(2):
            color = "#FFFFFF" if cm[i][j] > (np.max(cm) / 2) else "#0B0D14"
            ax.text(j, i, str(cm[i][j]), ha="center", va="center", color=color, fontsize=12, fontweight="bold")

    plt.tight_layout()
    cm_path = RESULTS_DIR / "confusion_matrix.png"
    plt.savefig(cm_path, dpi=200, facecolor=fig.get_facecolor(), edgecolor="none")
    plt.close()
    print(f"[OK] Confusion matrix plot saved to: {cm_path}")

    # Also copy to public directory for frontend visualization
    public_cm_path = PROJECT_ROOT / "public" / "confusion_matrix.png"
    public_cm_path.parent.mkdir(parents=True, exist_ok=True)
    import shutil
    shutil.copy2(cm_path, public_cm_path)

    metrics_payload = {
        "status": "EVALUATION_COMPLETE",
        "model": "DogCat_CNN_Classifier",
        "accuracy": round(acc * 100, 2),
        "precision": round(prec * 100, 2),
        "recall": round(rec * 100, 2),
        "f1_score": round(f1 * 100, 2),
        "val_loss": round(val_loss, 4),
        "confusion_matrix": cm,
        "total_evaluated": len(y_true),
        "charts": {
            "confusion_matrix": "/confusion_matrix.png",
            "training_curves": "/training_curves.png"
        }
    }

    with open(METRICS_JSON, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)

    PUBLIC_METRICS_JSON.parent.mkdir(parents=True, exist_ok=True)
    with open(PUBLIC_METRICS_JSON, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)

    print(f"[OK] Metrics written to {METRICS_JSON}")
    return metrics_payload


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate trained Dog vs Cat CNN")
    parser.add_argument("--model", type=str, default=str(MODEL_PATH), help="Path to trained model")
    parser.add_argument("--batch-size", type=int, default=32, help="Evaluation batch size")
    args = parser.parse_args()

    evaluate_model(model_path=args.model, batch_size=args.batch_size)
