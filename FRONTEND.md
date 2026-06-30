Roadmap de implementación Frontend (MVP)

Yo lo dividiría en 8 etapas.

Foundation
    ↓
Layout
    ↓
Providers
    ↓
Design System
    ↓
Wallet
    ↓
API Layer
    ↓
Feature Modules
    ↓
Pages

No al revés.

ETAPA 1 — Foundation

Primero dejar listo el proyecto.

app/
components/
features/
hooks/
lib/
providers/
services/
types/
utils/
constants/
contexts/

Nada de tener componentes desperdigados.

lib

Todo lo que sea infraestructura.

lib/
    stellar/
    soroban/
    wallet/
    supabase/
    api/
services

Servicios externos.

services/

FundingAgreementService

WalletService

OrganizationService

DisbursementService

Estos nunca renderizan UI.

hooks

Todos los hooks personalizados.

hooks/

useWallet()

useAgreement()

useOrganizations()

useMilestones()

useTransactions()
types
types/

agreement.ts

wallet.ts

organization.ts

milestone.ts

events.ts
utils

Funciones puras.

formatAmount()

shortAddress()

formatDate()

parseContractError()

statusColor()
ETAPA 2 — Providers

Esta es probablemente la parte más importante.

Tener un árbol así:

<AppProviders>

    ThemeProvider

    QueryProvider

    WalletProvider

    SorobanProvider

    NotificationProvider

    ModalProvider

</AppProviders>

Nunca meter lógica en layout.tsx.

WalletProvider

Aquí es donde repartirás:

address

signer

network

wallet

isConnected

connect()

disconnect()

signTransaction()

signAuthEntry()

Toda la aplicación consume esto.

Nunca volver a llamar WalletKit desde otro componente.

SorobanProvider

Este provider conoce:

RPC

Network Passphrase

Factory Address

Contracts

Simulation


Y expone:

invoke()

simulate()

read()

deploy()


Así desacoplas completamente Stellar del resto del proyecto.

ETAPA 3 — API Layer

No quiero ver llamadas RPC desde React.

Mala práctica:

Dashboard

↓

fetch()

↓

RPC

Debe ser:

Dashboard

↓

useAgreement()

↓

AgreementService

↓

SorobanClient

↓

RPC
ETAPA 4 — Feature Modules

Aquí empieza DDD.

features/

wallet/

agreements/

organizations/

milestones/

dashboard/

settings/

Cada feature tiene todo.

Ejemplo

agreements/

components/

hooks/

services/

types/

utils/

pages/
ETAPA 5 — Component Library

No construir componentes para una página.

Construir componentes reutilizables.

Ejemplo.

components/

ui/

layout/

cards/

tables/

forms/

status/

wallet/

charts/

dialogs/
Card

No hacer

AgreementCard

OrganizationCard

MilestoneCard

Primero construir

Card

CardHeader

CardBody

CardFooter

Luego especializar.

Tables

Tener una tabla genérica.

DataTable<T>

Y reutilizar.

Status

Un Badge.

<StatusBadge status="Active"/>

<StatusBadge status="Paused"/>

<StatusBadge status="Completed"/>

Nunca repetir colores.

Progress

Un solo componente.

ProgressBar

Que sirva para:

milestones
agreements
disbursements
Wallet Components

Crear una carpeta propia.

wallet/

ConnectWalletButton

WalletInfo

WalletAvatar

NetworkBadge

WalletDropdown


Todo reutilizable.

ETAPA 6 — Context Global

Aquí sí.

Yo tendría un contexto así.

WalletContext

address

signer

wallet

network

publicKey

isConnected

isConnecting

connect()

disconnect()

refresh()

sign()


No más.

No guardar contratos aquí.

No guardar agreements.

No guardar organizaciones.

Solo wallet.

Luego

SorobanContext

rpc

network

invoke()

simulate()

read()


Separado.

Luego

AgreementContext

NO.

No lo haría.

Para eso existe React Query.

ETAPA 7 — React Query

Toda la data del protocolo.

useAgreements()

↓

AgreementService

↓

RPC

↓

cache

No usar Context para datos remotos.

ETAPA 8 — Pages

Recién ahora.

dashboard

agreements

agreement/[id]

organizations

settings

Las páginas deberían medir menos de

200 líneas.

Idealmente.

Toda la lógica vive fuera.

Arquitectura Final
src/

app/

providers/

contexts/

components/

features/

agreements/

wallet/

dashboard/

organizations/

hooks/

services/

lib/

stellar/

soroban/

wallet/

types/

utils/

constants/
Mi recomendación adicional: incorporar un SDK interno

Hay un punto que agregaría y que suele marcar la diferencia entre un proyecto de hackathon y uno que puede crecer a producción.

En lugar de que AgreementService construya transacciones directamente, crearía una capa de SDK interno:

lib/
└── sdk/
    ├── agreements/
    │   ├── createAgreement.ts
    │   ├── activateAgreement.ts
    │   ├── approveMilestone.ts
    │   └── completeAgreement.ts
    ├── factory/
    ├── transactions/
    └── index.ts

El flujo quedaría:

React Component
        │
        ▼
Custom Hook (useAgreement)
        │
        ▼
AgreementService
        │
        ▼
Impact SDK (lib/sdk)
        │
        ▼
Soroban Client
        │
        ▼
RPC

Las ventajas son importantes:

Toda la lógica blockchain vive en un solo lugar.
Si en el futuro publican un @impact-protocol/sdk, esa carpeta prácticamente se convierte en el paquete npm.
El frontend queda desacoplado de Soroban.
El backend, scripts de testing o una CLI pueden reutilizar exactamente la misma lógica.
Facilita enormemente escribir tests unitarios y mocks.
Orden de ejecución que seguiría
Inicializar la estructura del proyecto (src, features, components, lib, services, providers).
Construir AppProviders con ThemeProvider, QueryProvider, WalletProvider y SorobanProvider.
Implementar WalletProvider usando Stellar Wallets Kit y exponer address, signer, network y métodos de conexión.
Crear el SorobanClient y el SDK interno (lib/sdk).
Desarrollar la biblioteca de componentes base (Button, Card, DataTable, StatusBadge, ProgressBar, Dialog, etc.).
Implementar los servicios y hooks (AgreementService, useAgreements, useWallet, etc.).
Construir los módulos de negocio (features/agreements, features/dashboard, etc.).
Crear las páginas, que únicamente orquestan componentes y consumen hooks.