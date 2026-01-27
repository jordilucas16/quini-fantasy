"""Command-line interface."""

from quini_fantasy.logging import get_logger

logger = get_logger(__name__)


def main() -> None:
    """Main entry point."""
    logger.info("Starting quini-fantasy")
    print("Hello from quini-fantasy!")


if __name__ == "__main__":
    main()
