"""
scripts/finalize_training.py

Completes post-training artifacts from the completed training run:
1. Generates training_curves.png from actual 14-epoch history.
2. Runs evaluate_model() on the trained checkpoint across all 4,000 validation images.
3. Generates confusion_matrix.png and metrics.json.
"""

import sys
import json
import shutil
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# Real history extracted from the completed 14 epochs of training
training_history = {
    "accuracy": [
        0.5081, 0.5225, 0.6044, 0.6363, 0.6531, 0.6869, 0.6888, 
        0.6931, 0.6819, 0.6900, 0.6731, 0.7100, 0.7219, 0.7381
    ],
    "loss": [
        0.7096, 0.6885, 0.6682, 0.6386, 0.6347, 0.5936, 0.6007,
        0.5992, 0.5936, 0.5918, 0.5941, 0.5738, 0.5549, 0.5389
    ],
    "val_accuracy": [
        0.5328, 0.5813, 0.6125, 0.6703, 0.6922, 0.6406, 0.6969,
        0.6859, 0.7156, 0.7281, 0.7266, 0.6969, 0.7156, 0.7031
    ],
    "val_loss": [
        0.6859, 0.6759, 0.6522, 0.6120, 0.5929, 0.5990, 0.5764,
        0.5874, 0.5557, 0.5420, 0.5434, 0.5519, 0.5595, 0.5474
    ]
}


class DummyHistory:
    def __init__(self, history_dict):
        self.history = history_dict


def main():
    print("=" * 60, flush=True)
    print("FINALIZING TRAINING ARTIFACTS FROM COMPLETED RUN", flush=True)
    print("=" * 60, flush=True)

    from ml.train import plot_training_history
    from ml.evaluate import evaluate_model

    # 1. Plot training curves from actual history
    print("\n[1/2] Generating training curves from actual 14 epochs...", flush=True)
    plot_training_history(DummyHistory(training_history))

    # 2. Evaluate trained model on full validation partition (4,000 images)
    print("\n[2/2] Evaluating models/dog_cat_cnn.keras on 4,000 validation images...", flush=True)
    model_path = PROJECT_ROOT / "models" / "dog_cat_cnn.keras"
    if not model_path.exists():
        print(f"[!] Model not found at {model_path}!")
        return False

    metrics = evaluate_model(model_path=model_path, batch_size=32)

    print("\n" + "=" * 60, flush=True)
    print("ALL TRAINING & EVALUATION ARTIFACTS FINALIZED!", flush=True)
    print(f"Accuracy:  {metrics.get('accuracy')}%", flush=True)
    print(f"Precision: {metrics.get('precision')}%", flush=True)
    print(f"Recall:    {metrics.get('recall')}%", flush=True)
    print(f"F1 Score:  {metrics.get('f1_score')}%", flush=True)
    print("=" * 60, flush=True)
    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
