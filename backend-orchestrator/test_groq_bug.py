from app.llm.fallback_chain import GROQ_LLM
from app.graph.nodes.pricer import PRICER_TOOLS
from langchain_core.messages import HumanMessage
import asyncio

async def test_groq():
    llm = GROQ_LLM.bind_tools(PRICER_TOOLS)
    print("Testing groq tool binding...")
    messages = [HumanMessage(content="Price a call with spot 100 strike 100")]
    try:
        res = await llm.ainvoke(messages)
        print("Success!", res.tool_calls)
    except Exception as e:
        print("Exception:", str(e))

if __name__ == "__main__":
    asyncio.run(test_groq())
