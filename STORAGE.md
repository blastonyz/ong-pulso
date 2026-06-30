Phase 1 — Step 2: Storage Model

Once the public interface is defined, the next step is to define how the contract state will be stored.

In Soroban, storage is one of the most important aspects because it affects:

execution cost;
storage cost (rent);
indexing ease;
contract maintainability;
future evolution.

The goal of the MVP is to store only the canonical state of the on-chain protocol. Anything that can be reconstructed from events or maintained off-chain (Supabase) should not occupy space in the contract.

Design Principles

We will follow these principles:

Single Source of Truth on-chain.
Avoid duplication.
Small, serializable data.
Simple reads.
Atomic writes.
Versioning ready.

What should live on-chain?

Only information critical to the execution of the protocol should be stored.

Agreement

Contains:

Status
Participants
Configuration
Timestamps
Metadata reference
Number of milestones

Does not contain documents.

Milestones

Each milestone must be stored individually.

It is not advisable to store a giant Vec<Milestone> because each modification requires rewriting the entire vector.

Instead:

Milestone #0

Milestone #1

Milestone #2

Each one occupies its own space.

This scales much better.

Metadata

Herein lies the first important decision.

Alternatives:

Option A

Save everything.

Title

Description

Organization

Country

Website

etc.

Advantages

Easy queries.

Disadvantages
Huge storage
Expensive
Difficult to modify
Option B (Recommended)

Store only:

metadata_uri

Example

ipfs://...

ar://...

https://...

All descriptive metadata resides outside the contract.

The contract only verifies the reference.

This is the recommended option for the MVP.

Documents

Do NOT store documents.

Never.

Store only references.

ipfs://...

hash

cid

Supabase will store additional information.

Participants

The contract only needs to know the wallets.

grantor

beneficiary

arbiter (optional)

It does not need:

names
emails
organizations

All of that resides outside the protocol.

Counters

Save:

milestone_count

This allows you to iterate through milestones from:

0..milestone_count

Without auxiliary structures.

Configuration

It's advisable to group the configuration.

AgreementConfig

Example

allow_partial_completion

requires_all_milestones

settlement_adapter

version

This allows the contract to evolve without modifying the Agreement.

Timestamps

Save only the necessary ones.

created_at

updated_at

completed_at

Do not save history.

History is generated from events.

History

Do not store:

State1

State2

State3

State4

Because:

Soroban already contains events.

Supabase will index all events.

Duplicating it would waste storage.

Storage Keys

Instead of using strings.

"agreement"

"milestone"

"config"

I recommend an enum.

StorageKey

Conceptual example:

enum StorageKey {
Agreement,
Config,
Milestone(u32),
}

Advantages:

Typed
Fewer errors
Lower cost
Easy to extend
Complete model
Agreement
Agreement

Proposed fields:

status

grantor

beneficiary

metadata_uri

milestone_count

config

created_at

updated_at

completed_at (Optional)
Milestone
Milestone

Fields:

id

status

amount

metadata_uri

completed_at

Note that each milestone also has its own metadata_uri. This allows the description, deliverables, evidence, or specific documentation of the milestone to evolve without increasing on-chain storage.

Config
AgreementConfig

Fields:

version

settlement_adapter

allow_partial_completion

requires_all_milestones
Storage Organization
Contract Storage
│
├── Agreement
│
├── Config
│
├── Milestone(0)
│
├── Milestone(1)
│
├── Milestone(2)
│
└── ...

There are no giant lists.

Each object is independent.

Why not store a Vec<Milestone>?

Alternative:
Agreement {
milestones: Vec<Milestone>
}
Advantages:

simple initial implementation;

single read. Disadvantages
Any change requires reserializing the entire vector;
Increased storage and gas consumption as the number of milestones grows;
Less flexibility for future extensions.

Recommendation

Store each milestone as a separate storage entry, indexed by its identifier (StorageKey::Milestone(id)).

This approach:

Scales better;
Reduces the cost of updates;
Facilitates future features such as pagination, selective queries, or indexers.

Decisions Adopted
Chosen Decision Reason
Agreement as a single object ✅ Aggregate domain root
Independent Milestones ✅ Better scalability and lower write cost
Metadata via URI ✅ Minimizes on-chain storage
Documents outside the contract ✅ The protocol only certifies references
Participants as Address ✅ The contract does not need personal data
Separate configuration ✅ Facilitates evolution and versioning
History via events ✅ Avoids information duplication
StorageKey