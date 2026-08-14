"""A small dependency-free CLI for bootstrapping and health checks."""

import argparse
import json

from apexquant import __version__
from apexquant.config import DEFAULT_SETTINGS


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="apexquant", description="ApexQuant 0.0.1 research and paper-trading tools")
    parser.add_argument("--version", action="version", version=__version__)
    subparsers = parser.add_subparsers(dest="command")
    doctor = subparsers.add_parser("doctor", help="检查本地脚手架配置")
    doctor.add_argument("--json", action="store_true", dest="as_json")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    if args.command == "doctor":
        payload = {"status": "ready", "version": __version__, "timezone": DEFAULT_SETTINGS.timezone, "real_broker": False}
        print(json.dumps(payload, ensure_ascii=False) if args.as_json else "ApexQuant 0.0.1 ready; real broker disabled")
        return 0
    build_parser().print_help()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

