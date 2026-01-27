"""Configuration management."""

from dataclasses import dataclass


@dataclass
class Config:
    """Application configuration."""

    debug: bool = False
    log_level: str = "INFO"


def get_config() -> Config:
    """Get application configuration."""
    return Config()
