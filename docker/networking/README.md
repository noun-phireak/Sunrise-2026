# Docker Networking — Fundamentals Lab

A hands-on lab on **how containers connect** — taught with plain `docker`
commands, **before** you ever write a Dockerfile. One folder per network
**driver**, each with a `README.md`: what it is, the exact commands, and the
expected output.

> A container needs two things from the outside world: somewhere to **store data**
> (see the [`../volumes`](../volumes) lab) and a way to **connect**. This lab is
> the connectivity half — the network **drivers** and how they differ.

## Requirements
- Docker installed (`docker --version`) — tested on Docker 29.x
- A terminal
- Lesson `05` (overlay) uses **Swarm mode** (`docker swarm init`)

## The network drivers (this is the whole point)

| Driver | Scope | Reach others by name? | Reach from host | Use it for |
|--------|-------|:---:|-----------------|-----------|
| **bridge (default)** | one host | ❌ IP only | publish a port (`-p`) | the default; simple cases |
| **bridge (user-defined)** | one host | ✅ built-in DNS | publish a port (`-p`) | **most single-host apps** |
| **host** | one host | n/a (it *is* the host) | direct, no `-p` | max performance (Linux) |
| **none** | none | ❌ no network | ✗ isolated | untrusted / offline jobs |
| **overlay** | **many hosts** | ✅ built-in DNS | via Swarm services | clusters (Swarm) |

## The lessons

| # | Folder | Driver | One-liner |
|---|--------|--------|-----------|
| 1 | `01-default-bridge` | `bridge` (default) | Auto-assigned; talk by **IP**, **no DNS** |
| 2 | `02-user-defined-bridge` | `bridge` (custom) | You create it; talk **by name** (DNS) — **preferred** |
| 3 | `03-host` | `host` | Share the host's stack; no `-p` (Linux) |
| 4 | `04-none` | `none` | No network at all — total isolation |
| 5 | `05-overlay` | `overlay` | Spans **multiple hosts** (Swarm) |

## How to teach with this
```bash
cd 01-default-bridge
cat README.md          # notes + commands + expected output
```
Best teaching move: run `01` then `02` back to back. On the **default** bridge,
`ping web` **fails** (no DNS); on a **user-defined** bridge, `ping web` **works**.
That single difference is why real apps always use a user-defined network (and
why Compose makes one for you).

## See what's there
```bash
docker network ls                     # bridge, host, none are always present
docker network inspect <name>         # which containers, subnet, gateway
docker network create mynet           # make a user-defined bridge
docker network connect mynet <c>      # attach a running container
docker network rm mynet               # remove it
```

## The mental model
- **bridge** = a private switch **inside one host** (default = no DNS, custom = DNS).
- **host** = *no* isolation, the container uses the host's own network.
- **none** = *total* isolation, no network.
- **overlay** = a virtual switch stretched **across many hosts**.

## Where this fits
`docker run` basics → **volumes** → **this (networking)** → Dockerfile → Compose.
Once containers can store data and talk to each other, you're ready to package
them into images and orchestrate them.
