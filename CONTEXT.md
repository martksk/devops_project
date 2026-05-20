# Character Voting Context

This context describes the character voting system, which enables participants to rank and vote on different characters.

## Language

**Character**:
An entity eligible to receive votes in the system. Consists of a unique identifier, name, and visual avatar URL.
_Avoid_: Hero, player, user, voter.

**Vote**:
An action representing a single increment of preference for a **Character**. It is persistent and integer-based.
_Avoid_: Choice, point, click, like.

**Voting Service**:
The Express-based API backend managing data persistence and business logic for voting.
_Avoid_: Server, backend, database.

**Voting Client**:
The Next.js-based web frontend presenting the UI dashboard and leaderboard.
_Avoid_: Frontend, website, UI, application.

## Example Dialogue

**Developer**: "How does the **Voting Client** fetch the latest rankings?"
**Domain Expert**: "It requests the list of **Characters** from the **Voting Service**, which returns them sorted by their total accumulated **Votes** in descending order."
