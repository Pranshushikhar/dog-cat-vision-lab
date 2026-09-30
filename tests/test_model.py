"""
tests/test_model.py

Unit tests for CNN architecture metadata, layer shapes, and model loading safeguards.
"""

import pytest
from pathlib import Path
from ml.model import get_architecture_metadata, load_model_if_exists
from ml.predict import get_inference_model


def test_architecture_metadata_structure():
    """Verify architecture metadata reports correct layer shapes and non-fabricated specs."""
    meta = get_architecture_metadata(model=None, input_shape=(224, 224, 3))
    assert meta["input_shape"] == [224, 224, 3]
    assert len(meta["layers"]) >= 10
    assert any(l["name"] == "conv2d_block1" for l in meta["layers"])
    assert any(l["name"] == "binary_output" for l in meta["layers"])


def test_missing_model_safeguard():
    """Verify that predicting without trained weights raises FileNotFoundError('MODEL_NOT_TRAINED')."""
    fake_path = Path("models/non_existent_model_checkpoint.keras")
    with pytest.raises(FileNotFoundError) as exc_info:
        get_inference_model(model_path=fake_path)
    assert "MODEL_NOT_TRAINED" in str(exc_info.value)
