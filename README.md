# Glimpse <> XRP

Glimpse is ~~

### About Code Repository
This repository was forked from an existing product that was under development prior to starting the demo project.
The code was refined to include only the necessary parts while excluding sensitive information.
The project is built using the [NestJS framework](https://docs.nestjs.com/) (based on Node.js), with XRP-related code implemented as custom modules in accordance with NestJS architecture.
For the purpose of creating a demo website, static HTML and CSS files were embedded within NestJS to enable server-side rendering.

Functions related to XRP, registered as a module, are designed to be called from the application service layer and executed with the necessary business logic.
XRP-related code is organized into the following modules: [Code: XRP Module](./src/config/crypto/xrpl)

In addition, AWS S3 was used to implement the infrastructure for managing NFT metadata on the platform, providing the necessary backend functionality for handling and storing NFT-related data.

### Requirements
- [NestJS](https://docs.nestjs.com/)
- [xrpl.js](https://xrpl.org/docs/tutorials/javascript)
- [AWS S3](https://aws.amazon.com/pm/serv-s3/?gclid=CjwKCAiAxqC6BhBcEiwAlXp45zml2xVzVBspWLX18I1u7JInzl4Bp5WuSQAqA3tN0Ndz96vy3UoSYhoCzGgQAvD_BwE&trk=024bf255-8753-410e-9b2f-8015932510e8&sc_channel=ps&ef_id=CjwKCAiAxqC6BhBcEiwAlXp45zml2xVzVBspWLX18I1u7JInzl4Bp5WuSQAqA3tN0Ndz96vy3UoSYhoCzGgQAvD_BwE:G:s&s_kwcid=AL!4422!3!588924203916!e!!g!!aws%20s3!16390143117!134236388536)
- [Redis](https://redis.io/docs/latest/) - Caching and login session management.

### Architecture

### Detailed explanation of XRP usage
#### 1. Create a Wallet
Users who want to join the platform begin by logging in or signing up.
Upon successful authentication, a wallet is automatically created for them.
This wallet acts as a central hub for managing their tickets and transactions on the platform, ensuring seamless integration with XRP-based functionalities.
For testing purposes, the platform uses the XRP Faucet to provide users with a starting balance of XRP.
[[Code: create a wallet](./src/config/crypto/xrpl/services/xrpl-wallet.service.ts)]

#### 2. Batch Mint NFTs (with XRP Ticket)
Event hosts can create events on the platform.
During the event creation process, the system enables bulk minting of NFT tickets in a single operation.
But Batch minting tasks can take a long time, so the system supports processing tasks asynchronously in the background.
[[Code: create XRP tickets](./src/config/crypto/xrpl/services/xrpl-ticket.service.ts) /
[Code: batch mint NFTs](./src/config/crypto/xrpl/services/xrpl-nft.service.ts)]

#### 3. Sell Offer for NFTs
Users can browse a list of available events.
Users can also register for an event.
For testing purposes, The registration process is streamlined, with automatic approval ensuring that users can secure their tickets without delays.
After registering, the platform automatically creates an XRP-based buy offer for the corresponding NFT ticket.
The system is designed to auto-accept the offer, simplifying the process and ensuring users immediately acquire their event NFT tickets.
But These processes tasks can take a long time, so the system supports processing tasks asynchronously in the background.
[[Code: sell offer & accept offer](./src/config/crypto/xrpl/services/xrpl-nft.service.ts)]

#### 4. View NFTs
In the "My Page" section, users can view a list of all their tickets.
Each ticket is represented as an NFT linked to their wallet.
Clicking on a specific ticket provides detailed information.
Users can also access metadata associated with their NFT tickets.
This includes unique identifiers, event-specific details, and other information encoded into the NFT.

#### 5. Transfer XRP
Users can access their wallet from the "My Page" section to check their current XRP balance.
Users can delve deeper into their wallet details or initiate XRP transfers directly from the platform.
For testing purposes, the platform supports XRP Devnet, providing a sandbox environment for seamless experimentation and transactions.
[[Code: transfer XRP](./src/config/crypto/xrpl/services/xrpl-wallet.service.ts)]


### Installation
1. Clone the repository
2. Install the dependencies
```bash
npm install
```
3. Install Database & Redis
```bash
docker compose up -d
npm run prisma:migrate
npx prisma db push
```
4. Create a `.env` file in the root directory
```bash
PORT = 8080

POSTGRES_DB = 'dev'
POSTGRES_USER = 'glimpse'
POSTGRES_PASSWORD = 'xrp-demo'
DATABASE_URL = "postgresql://glimpse:xrp-demo@localhost:5432/dev?schema=public"

S3_ACCESS_KEY = {YOUR AWS S3 ACCESS KEY}
S3_SECRET_KEY = {YOUR AWS S3 SECRET KEY}
S3_BUCKET_REGION = {YOUR AWS S3 BUCKET REGION}
S3_BUCKET_NAME = {YOUR AWS S3 BUCKET NAME}
CDN_URL = {YOUR CDN URL} # ex) https://cdn.example.com

SES_REGION = {YOUR AWS SES_REGION}
SES_ACCESS_KEY = {YOUR AWS SES_ACCESS_KEY}
SES_SECRET_KEY = {YOUR AWS SES_SECRET_KEY}
SES_DOMAIN = {YOUR AWS SES DOMAIN}

REDIS_URL = 'redis://localhost:6379'
CACHE_TTL = 5

ACCESS_TOKEN_SECRET = 'xrp-demo-access-token-secret'
REFRESH_TOKEN_SECRET = 'xrp-demo-refresh-token-secret'
CREATE_USER_TOKEN_SECRET = 'xrp-demo-create-user-token-secret'

#TTL(seconds)
ACCESS_TOKEN_TTL = 2592000          #30 minutes
REFRESH_TOKEN_TTL = 2592000      #1 month
CREATE_USER_TOKEN_TTL = 1800         #30 minutes

XRPL_NODE = 'wss://s.devnet.rippletest.net:51233/'
```

### Running the service (in development mode)
```bash
npm run start:dev
```
When the server is running, access this URL(http://localhost:8080).


### [Demo video]()


### References
<details>
<summary>ERD</summary>
<div markdown="1">

![ERD](https://cdn.glimpse.rsvp/users/avatars/83db899a-0a18-4352-a15e-461846b00790.png)

</div>
</details>
<details>
<summary>User Flow</summary>
<div markdown="1">

![User Flow](https://cdn.glimpse.rsvp/users/avatars/a6b83d67-6fbc-4f8c-96e8-237598d0a188.png)

</div>
</details>

- [How to mint and sell NFTs](https://xrpl.org/docs/tutorials/javascript/nfts)
- [How to transfer XRP](https://xrpl.org/docs/tutorials/javascript/nfts/transfer-nfts)
- [Batch mint](https://xrpl.org/docs/tutorials/javascript/nfts/batch-mint-nfts)