"""Create website PDF copies using the approved print PDFs' existing trim boxes.
Usage: python scripts/prepare-menu-pdfs.py DRINKS_SOURCE.pdf WINE_SOURCE.pdf
Requires pypdf. Source files remain untouched.
"""
import argparse
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("drinks", type=Path)
parser.add_argument("wine", type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
for source, name in [(args.drinks, "drinks"), (args.wine, "wine")]:
    reader = PdfReader(source)
    writer = PdfWriter()
    for page in reader.pages:
        trim = list(page.trimbox)
        page.cropbox = RectangleObject(trim)
        page.mediabox = RectangleObject(trim)
        writer.add_page(page)
    writer.add_metadata({"/Title": "NIPO " + name.title()})
    destination = root / "public" / "menus" / ("nipo-" + name + ".pdf")
    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("wb") as output:
        writer.write(output)
    result = PdfReader(destination)
    original = PdfReader(source)
    assert len(result.pages) == len(original.pages)
    for before, after in zip(original.pages, result.pages):
        assert list(after.mediabox) == list(before.trimbox)
        assert before.get_contents().get_data() == after.get_contents().get_data()
    print(f"{destination}: {len(result.pages)} pages, content preserved")
