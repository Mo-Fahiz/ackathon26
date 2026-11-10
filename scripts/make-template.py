"""Builds public/downloads/ACKATHON-2026-One-Pager-Template.docx.

The template teams fill in to register an idea: a header, then nine boxes in three
columns (The problem / The idea / The bet), on one landscape A4 page.

Run:  python3 -m venv .venv && .venv/bin/pip install python-docx
      .venv/bin/python scripts/make-template.py
"""

from pathlib import Path

from docx import Document
from docx.enum.section import WD_ORIENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

OUT = Path(__file__).resolve().parent.parent / "public" / "downloads" / "ACKATHON-2026-One-Pager-Template.docx"

PURPLE = RGBColor(0x68, 0x41, 0xE6)
INK = RGBColor(0x14, 0x12, 0x1F)
GREY = RGBColor(0x6B, 0x69, 0x7A)

HEADER = [
    ("Idea name", "Six words or fewer."),
    ("One-line pitch", "We help [who] [do what] so that [what changes for them]."),
    ("Team", "Names and roles, plus the one skill you still need."),
    ("Flavour", "Grounded · Stretch · Wild"),
    ("Who would own this on Monday", "The line of business or customer journey."),
]

COLUMNS = [
    (
        "The problem",
        [
            ("1", "Who are you solving for?", "40 words",
             "One real person in one real moment, not a segment."),
            ("2", "What is their problem?", "60 words",
             "Say it the way they would. What do they do today, and what does it cost them?"),
            ("3", "How do you know it is real?", "50 words",
             "One number, one customer quote, or one thing you saw. If it is a hunch, say so."),
        ],
    ),
    (
        "The idea",
        [
            ("4", "The big idea", "25 words",
             "One sentence a customer would understand. The line every reviewer should repeat."),
            ("5", "Show it", "one sketch",
             "Three frames: before, the moment ACKO steps in, after. A hand sketch counts."),
        ],
    ),
    (
        "The bet",
        [
            ("6", "Why it matters to ACKO", "60 words",
             "Which number moves? Size it: people × how often × value. Why ACKO, why now?"),
            ("7", "What might kill it", "50 words",
             "The one assumption that, if wrong, makes it worthless. Compliance check: yes / no / not sure."),
            ("8", "What you will build", "50 words",
             "The moment you will show on demo day. What is real, what is faked, what is left out."),
            ("9", "How you will know it worked", "50 words",
             "A test of your riskiest assumption with a pass mark, e.g. 7 of 10 finish in under a minute."),
        ],
    ),
]


def shade(cell, hex_fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_fill)
    tc_pr.append(shd)


def borders(table, color="D9D6E6"):
    tbl_pr = table._tbl.tblPr
    b = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        e = OxmlElement(f"w:{edge}")
        e.set(qn("w:val"), "single")
        e.set(qn("w:sz"), "6")
        e.set(qn("w:color"), color)
        b.append(e)
    tbl_pr.append(b)


def run(p, text, size=9, bold=False, italic=False, color=INK):
    r = p.add_run(text)
    r.font.size = Pt(size)
    r.bold = bold
    r.italic = italic
    r.font.color.rgb = color
    return r


def tight(p, after=0):
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(after)


def main():
    doc = Document()
    style = doc.styles["Normal"]
    style.font.name = "Arial"
    style.font.size = Pt(9)

    sec = doc.sections[0]
    sec.orientation = WD_ORIENT.LANDSCAPE
    sec.page_width, sec.page_height = Cm(29.7), Cm(21.0)
    for side in ("left_margin", "right_margin"):
        setattr(sec, side, Cm(1.4))
    sec.top_margin = sec.bottom_margin = Cm(1.1)

    p = doc.add_paragraph()
    tight(p, 2)
    run(p, "ACKATHON 2026", 9, bold=True, color=PURPLE)
    run(p, "   ·   Idea one-pager", 9, color=GREY)
    p = doc.add_paragraph()
    tight(p, 6)
    run(p, "About 400 words plus one sketch. Replace each grey prompt with your answer. "
           "Write for someone from another team: plain words, numbers over adjectives. Only the page counts.",
        8.5, italic=True, color=GREY)

    # Header block
    head = doc.add_table(rows=1, cols=len(HEADER))
    head.alignment = WD_TABLE_ALIGNMENT.CENTER
    borders(head)
    for cell, (label, prompt) in zip(head.rows[0].cells, HEADER):
        shade(cell, "F4F1FD")
        cp = cell.paragraphs[0]
        tight(cp, 1)
        run(cp, label, 8.5, bold=True)
        cp = cell.add_paragraph()
        tight(cp, 10)
        run(cp, prompt, 8, italic=True, color=GREY)

    p = doc.add_paragraph()
    tight(p, 4)

    # Three columns of boxes
    grid = doc.add_table(rows=1, cols=3)
    grid.alignment = WD_TABLE_ALIGNMENT.CENTER
    borders(grid)
    for cell, (title, boxes) in zip(grid.rows[0].cells, COLUMNS):
        cp = cell.paragraphs[0]
        tight(cp, 4)
        run(cp, title.upper(), 9, bold=True, color=PURPLE)
        for num, q, limit, prompt in boxes:
            cp = cell.add_paragraph()
            tight(cp, 1)
            run(cp, f"{num}  {q}", 9.5, bold=True)
            run(cp, f"  ·  {limit}", 8, color=GREY)
            cp = cell.add_paragraph()
            tight(cp, 2)
            run(cp, prompt, 8, italic=True, color=GREY)
            # Answer space; taller for the sketch box.
            for _ in range(5 if num == "5" else 3 if len(boxes) == 4 else 4):
                cp = cell.add_paragraph()
                tight(cp)
                run(cp, " ", 9)
            if num == "4":
                cp = cell.add_paragraph()
                tight(cp, 4)
                run(cp, "★ Keep this one sentence sharp: reviewers should be able to repeat it.", 7.5,
                    italic=True, color=PURPLE)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT)
    print(OUT)


if __name__ == "__main__":
    main()
