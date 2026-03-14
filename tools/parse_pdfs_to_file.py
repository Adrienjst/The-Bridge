import glob
from pypdf import PdfReader

with open("pdf_contents.txt", "w") as f:
    for pdf_path in sorted(glob.glob("/Users/adrienjuste/Desktop/Structuration CS/Course/*.pdf")):
        try:
            reader = PdfReader(pdf_path)
            f.write(f"\n{'='*50}\n--- {pdf_path.split('/')[-1]} ---\n{'='*50}\n")
            text = ""
            for i in range(min(5, len(reader.pages))): # Just read first 5 pages for table of contents
                text += reader.pages[i].extract_text() + "\n"
            f.write(text[:2000] + "\n")
        except Exception as e:
            f.write(f"Error reading {pdf_path}: {e}\n")
