# zConqueror

zConqueror is an onChain tower defense on starknet.

This integration taps into the powerful libraries designed by [Lattice](https://lattice.xyz/):

- [recs](https://github.com/latticexyz/mud/tree/main/packages/recs)

### Initial Setup

**Prerequisites:** First and foremost, ensure that Dojo is installed on your system. If it isn't, you can easily get it set up with:

```console
curl -L https://install.dojoengine.org | bash
```

Followed by:

```console
dojoup
```

For an in-depth setup guide, consult the [Dojo book](https://book.dojoengine.org/getting-started/quick-start.html).

### Launch the Example in Under 30 Seconds

After cloning the project, execute the following:

1. **Terminal 1 - Katana**:

```console
cd dojo-starter && katana --disable-fee
```

2. **Terminal 2 - Contracts**:

```console
cd dojo-starter && sozo build && sozo migrate

// Basic Auth - This will allow burner Accounts to interact with the contracts
sozo auth writer Position move
sozo auth writer Position spawn
sozo auth writer Moves move
sozo auth writer Moves spawn
```

3. **Terminal 3 - Client**:

## Local
```console
cd client && bun i && bun run dev
```
## Slot
```console
cd client && bun i && bun run slot
```

4. **Terminal 4 - Torii**:

Uncomment the 'world_address' parameter in `dojo-starter/Scarb.toml` then:

```console
cd dojo-starter && torii
```

Upon completion, launch your browser and navigate to http://localhost:5173/. You'll be greeted by the running example!

## 🛠 Tech Stack

This project utilizes a range of modern technologies to deliver optimal performance and user experience:

- **Framework**: 
  - [React](https://reactjs.org/)
- **Language**: 
  - [TypeScript](https://bun.sh/)
- **Package Manager**: 
  - [bun](https://www.npmjs.com/)
- **Build Tool**: 
  - [Vite](https://vitejs.dev/)
- **UI**:
  - [Shadcn](https://ui.shadcn.com/)
  - [TailwindCSS](https://tailwindcss.com/)


## Shadcn
Use the add command to add components and dependencies to your project.

```bash
bunx shadcn-ui@latest add [component]```

