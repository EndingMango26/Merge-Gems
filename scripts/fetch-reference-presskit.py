#!/usr/bin/env python3
"""Download three public press-kit references for local analysis, never the app bundle.

Standard HTTPS/ZIP ranges only; no application, protection or credential involved.
The files remain proprietary. Availability is not permission to redistribute them.
Usage: python3 scripts/fetch-reference-presskit.py [directory-outside-repository]
"""
from pathlib import Path
import hashlib
import json
import struct
import sys
import urllib.request
import zlib

URL = "https://www.gram.gs/assets/GramGames_PressKit.zip"
NAMES = {"Press Kit/MergeGems!_TrailerVideo.mp4", "Press Kit/MergeGems!_Logo.png", "Press Kit/MergeGems!_AppIcon.png"}
output = Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/merge-gems-reference-presskit").resolve()
project = Path(__file__).resolve().parents[1]
if output == project or project in output.parents:
    raise SystemExit("Choose a location outside the repository; references must not enter the published bundle.")


def byte_range(start, end):
    request = urllib.request.Request(URL, headers={"Range": f"bytes={start}-{end}"})
    with urllib.request.urlopen(request, timeout=60) as response:
        if response.status != 206:
            raise RuntimeError("Server does not support the required standard byte ranges")
        return response.read()


with urllib.request.urlopen(urllib.request.Request(URL, method="HEAD"), timeout=30) as response:
    size = int(response.headers["Content-Length"])
tail = byte_range(max(0, size - 65_557), size - 1)
position = tail.rfind(b"PK\x05\x06")
if position < 0:
    raise RuntimeError("No ZIP central directory found")
end_record = struct.unpack_from("<4s4H2LH", tail, position)
if end_record[1] != 0 or end_record[2] != 0:
    raise RuntimeError("Multi-disk ZIP is unsupported")
central = byte_range(end_record[6], end_record[6] + end_record[5] - 1)
entries, offset = [], 0
while offset < len(central):
    fields = struct.unpack_from("<4s6H3L5H2L", central, offset)
    if fields[0] != b"PK\x01\x02":
        raise RuntimeError("Invalid ZIP directory")
    name = central[offset + 46:offset + 46 + fields[10]].decode("utf-8")
    entries.append({"name": name, "method": fields[4], "crc32": fields[7], "compressed": fields[8], "size": fields[9], "offset": fields[16]})
    offset += 46 + fields[10] + fields[11] + fields[12]
output.mkdir(parents=True, exist_ok=True)
manifest = []
for entry in entries:
    if entry["name"] not in NAMES:
        continue
    if entry["compressed"] > 64_000_000 or entry["size"] > 64_000_000:
        raise RuntimeError("Reference exceeds the bounded download size")
    header = byte_range(entry["offset"], entry["offset"] + 29)
    fields = struct.unpack("<4s5H3L2H", header)
    if fields[0] != b"PK\x03\x04" or fields[2] & 1:
        raise RuntimeError("Invalid or encrypted ZIP member; stopping")
    start = entry["offset"] + 30 + fields[-2] + fields[-1]
    raw = byte_range(start, start + entry["compressed"] - 1)
    if entry["method"] == 8:
        data = zlib.decompress(raw, -15)
    elif entry["method"] == 0:
        data = raw
    else:
        raise RuntimeError("Unsupported compression method")
    if len(data) != entry["size"] or zlib.crc32(data) != entry["crc32"]:
        raise RuntimeError("Reference size or CRC mismatch")
    destination = output / Path(entry["name"]).name
    destination.write_bytes(data)
    manifest.append({"name": entry["name"], "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()})
if len(manifest) != len(NAMES):
    raise RuntimeError("The expected Merge Gems references are no longer all present")
(output / "provenance.json").write_text(json.dumps({"source": URL, "files": manifest}, indent=2))
print(json.dumps({"directory": str(output), "files": manifest}, indent=2))
