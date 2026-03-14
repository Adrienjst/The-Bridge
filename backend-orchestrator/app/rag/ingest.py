import os
from dotenv import load_dotenv
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, Settings
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

if not QDRANT_URL or not QDRANT_API_KEY:
    raise ValueError("Missing QDRANT_URL or QDRANT_API_KEY in .env")

# Use a free, high-performance HF embedding model for finance RAG
Settings.embed_model = "local:BAAI/bge-small-en-v1.5"
Settings.chunk_size = 512
Settings.chunk_overlap = 64

def run_ingestion():
    print(f"Connecting to Qdrant Cloud at {QDRANT_URL}...")
    client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
    
    # Store vectors in "structlab_courses" collection
    vector_store = QdrantVectorStore(client=client, collection_name="structlab_courses")

    # Path to the raw TypeScript module files containing the course texts
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../structuration-app/src/data/modules/"))
    print(f"Loading documents from {data_dir}...")
    
    # Load all TS files that contain the core theory, math, and structures
    reader = SimpleDirectoryReader(input_dir=data_dir, required_exts=[".ts"], recursive=True)
    documents = reader.load_data()
    
    print(f"Loaded {len(documents)} document chunk(s). Embedding and uploading...")
    
    # Generate embeddings and upload to Qdrant
    index = VectorStoreIndex.from_documents(
        documents,
        vector_store=vector_store,
        show_progress=True
    )
    
    print("Ingestion complete! The Mega-Copilot now knows the entire StructLab curriculum.")

if __name__ == "__main__":
    run_ingestion()
