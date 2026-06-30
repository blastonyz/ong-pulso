Phase 1 — Smart Contracts
Step 1. Contract Interface Specification

Before writing a single line of Rust code, the contract needs to define its public interface.

In Soroban, the public interface is the equivalent of the protocol's public API.

It must be:

stable;
small;
explicit;
domain-oriented.

We will not expose internal storage details.

Objective

To define all the public functions of the Funding Agreement contract.

The idea is that any client (Dashboard, SDK, CLI, or third party) can interact solely through this interface.

Responsibilities of the Funding Agreement Contract

The contract must be solely responsible for:

storing the Agreement;
managing state;
managing milestones;
validating permissions;
emitting events;
accepting milestone approvals;
marking milestones as completed;
authorizing closure;
exposing queries.

It must not:

execute payments directly (SDP will handle this outside the contract);

Authenticate users (Wallet Kit);
Send emails;
Manage files;
Know Supabase.

This keeps the protocol clean.

Proposed Design

I group the API into six categories.

1. Constructor

Only the Factory should be able to invoke it.

initialize(...)

Responsibility:

Create Agreement
Register participants
Create initial milestones
Set configuration

It runs only once.

2. Queries

Purely read functions.

get_agreement()

get_status()

get_milestones()

get_milestone(id)

get_participants()

get_metadata()

get_version()

These functions never modify state.

3. Agreement Lifecycle

Operations on the Funding Agreement.

activate()

pause()

resume()

cancel()

complete()

archive()

Each function:

validates permissions
validates state transition
emits event
4. Milestone Lifecycle
submit_milestone(id)

approve_milestone(id)

reject_milestone(id)

complete_milestone(id)

Each moves the milestone's state machine.

5. Administration
update_metadata(...)

transfer_role(...)

add_observer(...)

remove_observer(...)

These operations are optional for the MVP, but I recommend including only:

update_metadata()

transfer_role()

Observer can wait.

6. Verification

Useful functions for SDKs.

has_role(address)

can_execute(action)

contract_version()

These are not essential, but they make building clients easier.

Parameter Types

The API should avoid large structures.

Instead of:

updateAgreement(...)

we prefer:

update_metadata(metadata)

approve_milestone(id)

submit_milestone(id)

transfer_role(role, new_address)

Small interfaces are much more stable.

Identifiers

I recommend that:

Agreement

Contract Address

be the primary identifier.

We don't need another UUID.

Each contract is already unique.

Milestones

u32

incremental.

Simple.

Compact.

Cheap gas.

Return Model

All mutable operations should return:

Result<(), ContractError>

Queries:

Agreement

Milestone

Vec<Milestone>

Status

Address

Metadata

Nothing else.

Events will communicate the rest.

Naming Convention

I recommend using verbal names.

Correct:

activate

pause

resume

approve_milestone

submit_milestone

Avoid:

setStatus()

doAction()

change()

execute()

Names should express domain intent.

Why not a generic `transition()` method?

An alternative would be:

transition(State::Active)

transition(State::Paused)

transition(State::Completed)
Advantages:
Fewer functions;
Smaller API. Disadvantages:
Loses business semantics;
Makes specific permissions difficult to manage during transitions;
Makes auditing and event handling more complex;
Reduces clarity for SDKs and clients.

Recommendation: Do not use a generic method. I prefer explicit methods (activate, pause, approve_milestone, etc.) because they make the API more self-explanatory, facilitate permission control, and maintain a clearer event history.

Design Decisions Adopted
Decision Chosen Reason
One Contract per Agreement ✅ Already defined by the architecture
Factory creates contracts ✅ Consistent and controlled deployment
Explicit API ✅ Greater readability and maintainability
Queries separate from Commands ✅ Follows the lightweight CQRS pattern without added complexity
Events for changes ✅ Facilitates indexing and auditing
Contract Address as ID ✅ Avoids redundant identifiers
u32 for Milestones ✅ Simplicity and low storage cost
Specific methods instead of transition() ✅ Better domain semantics and permission control
Deliverable of this stage

With this specification, the public interface of the FundingAgreement contract is defined, which will serve as a stable contract between the protocol and any client (Dashboard, SDK, or future integrations). From this API, we can design the storage model without exposing internal details or compromising the protocol's evolution.