"""Smoke tests."""

from quini_fantasy import __version__


def test_version() -> None:
    """Test that version is defined."""
    assert __version__ == "0.1.0"


def test_import() -> None:
    """Test that main modules can be imported."""
    from quini_fantasy import cli, config, logging

    assert cli is not None
    assert config is not None
    assert logging is not None
