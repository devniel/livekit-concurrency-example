Just a repo to check issues with the job requests of Livekit Cloud.

To run the app locally:

1. Create an account on Livekit Cloud.
2. Set the proper `.env` variables in `worker-backend` and `worker-ui`.
3. Run `pnpm install` in `worker-ui`.
4. Run `pnpm dev` in `worker-ui`.
5. Run `poetry install` in `worker-backend`.
6. Run `poetry run python main.py start` in `worker-backend` (also possible to run `poetry run python main.py dev`, only difference are idle processes, but problem persists).
7. Open `http://localhost:3000` in your browser.
8. Open the developer tools in your browser and go to the console tab.
9. Click "Start a conversation" 10 times, wait 2 seconds between each click.
10. Active conversations: `10` should be in the counter.
11. In the browser developer tools' console tab, there will be 10 `publishing track` logs.
12. You need to receive 10 job requests in the worker-backend logs, 
    - For `start` mode, find `{"message": "received job request"` in the logs.
    - For `dev` mode, find `received job request` in the logs.
13. If there are not `10` results, then your worker didn't receive all job requests or there was an issue in Livekit Cloud.
14. If we check Livekit Cloud dashboard's sessions (wait a bit as there is a delay to show the list of sessions), we will see `10` active sessions (we can notice them by the room name); but we will see only `1` participant on the ones we didn't receive a job request.

PD: This really not happens with a local Livekit server (`livekit-server --dev --bind 0.0.0.0`), except for scenarios with very high stress, e.g. creating 40 conversations, waiting 0.1 seconds between each click, and we won't receive only 2 job requests.
