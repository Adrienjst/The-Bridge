import os
import glob
from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

if not QDRANT_URL or not QDRANT_API_KEY:
    raise ValueError("Missing QDRANT_URL or QDRANT_API_KEY in .env")

# Model configuration
model_name = "BAAI/bge-small-en-v1.5"
model_kwargs = {'device': 'cpu'}
encode_kwargs = {'normalize_embeddings': True}
hf_embeddings = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)

def run_ingestion():
    print(f"Connecting to Qdrant Cloud at {QDRANT_URL}...")
    
    # Path to the raw TypeScript module files containing the course texts
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../structuration-app/src/data/modules/"))
    print(f"Loading TS documents from {data_dir}...")
    
    all_docs = []
    ts_files = glob.glob(os.path.join(data_dir, "*.ts"))
    
    for file_path in ts_files:
        print(f"Loading {file_path}")
        try:
            loader = TextLoader(file_path, encoding='utf-8')
            all_docs.extend(loader.load())
        except Exception as e:
            print(f"Error loading {file_path}: {e}")
        
    print(f"Loaded {len(all_docs)} module files.")
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    chunks = text_splitter.split_documents(all_docs)
    print(f"Split into {len(chunks)} chunks. Embedding and uploading to Qdrant 'structlab_courses' collection...")
    
    # Generate embeddings and upload to Qdrant
    QdrantVectorStore.from_documents(
        chunks,
        hf_embeddings,
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
        collection_name="structlab_courses",
        force_recreate=True
    )
    
    print("Ingestion complete! The Mega-Copilot now knows the entire StructLab curriculum via LangChain/Qdrant.")

if __name__ == "__main__":
    run_ingestion()
