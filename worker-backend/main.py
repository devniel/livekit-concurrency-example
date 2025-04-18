from livekit.agents import (
    JobContext,
    WorkerOptions,
    cli,
)

from dotenv import load_dotenv
import logging

load_dotenv()


async def entrypoint(ctx: JobContext):
    await ctx.connect()


if __name__ == "__main__":
    logging.info("starting worker")
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
