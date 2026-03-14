import glob
try:
    from pypdf import PdfReader
except ImportError:
    print("pypdf not installed. Please install pypdf.")
    exit(1)

for pdf_path in sorted(glob.glob("/Users/adrienjuste/Desktop/Structuration CS/Course/*.pdf")):
    try:
        reader = PdfReader(pdf_path)
        print(f"\n{'='*50}\n--- {pdf_path.split('/')[-1]} ---\n{'='*50}")
        text = ""
        for i in range(min(5, len(reader.pages))): # Just read first 5 pages for table of contents
            text += reader.pages[i].extract_text() + "\n"
        print(text[:1500])
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
