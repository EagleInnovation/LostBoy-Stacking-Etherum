# **CryptoPuppies Marketplace**

### Team 6: 
<p align="center">
  <img width="200" height="200" src="https://github.com/vmieres/CryptoPuppies_Marketplace/blob/main/images/puppy_coin.png?raw=true">
</p>

<p align="center"> 
Harish Chandramohan, Matthew Musgrave, Alex Hall, Victor Mieres, Valentina Buritica
 </p>

### Demo App
Click [here](https://harishkumarchandra.github.io/Crypto_Puppy/) to launch the CryptoPuppies application.

![](https://miro.medium.com/max/4000/1*o9fACvNgYkWGGNqCyYRBMw.png)



We are designing a decentralized marketplace which can be further extended to meet specific requirements. Moreover, we are developing smart contracts of this marketplace to be deployed on the Ethereum blockchain. Also, we are develing a backend to interact with the smart contracts of the marketplace. 

### **Below we describe development tools used.**
For the development of smart contracts for decentralized marketplace, we are using Solidity programming language, which is the most popular contract-oriented language for Ethereum. 

In order to compile, deploy, and test our Solidity smart contracts, we used the Truffle IDE to test and deploy contracts. This framework is easy to use, and smart contracts can be compiled and deployed using simple commands. Truffle is compatible with live blockchain test networks, which can be used for deployment of smart contracts.

For testing purposes, we used Ganache, a personal Ethereum blockchain that was created by Truffle developers. The friendly UI of Ganache made it easy for us to observe the process and transactions during testing.

### **Blockchain. What is it?**
A blockchain is a peer-to-peer network of computers or nodes, that talk to each other. It is a distributed network where all the participants share the responsibility of running the network. Moreover, each network participant maintains a copy of the code and data of the blockchain. All of this data is contained in bundles of records called "blocks"  which are chained together to make up the blockchain. All of the nodes on the network ensure that this data is secure and unchangeable, unlike a centralized application where the code and data can be changed at any time.  

### **Smart Contract. What is it?**
Smart contracts are written in a programming language called Solidity, which is similar to JavaScript. All of the code in the smart contract is unchangeable or inmmutable. Once deployed to the blockchain we won't be able to change it. This feature is to make sure that the code is secure.

### **Installing Dependencies**
Now let's install all of the dependenes we need to buid out project. Frist, we need to set up a personal blockchain to develop the applicaton locally.

### **Ganache Personal Blockchain**
The dependency is a personal blockchain, which is a local development blockchain that we can used to recreate the behavior of a public blockchain. In this case we will use [Ganache](https://www.trufflesuite.com/ganache) as our personal blockchain for Ethereum development. It will allow us to deploy smart contracts,develop applications and run tests. it is available on Linux, Mac and Windows as a desktop application and a command line tool.

![](images/ganache.png)


Photo or gif of opened ganache

### **Node JS**
Now that you have Ganache running, you will need to configure the environment for developing smart contracts. The first dependency that we need is [Node Package Manager](https://nodejs.org/en/download/package-manager/) which comes with Node.js 
You can check if you have node already installed by going to your terminal and tying: ```node -v```

![](images/node.png)

### **Truffle** 

Now we need to install the [Truffle Framework](https://www.trufflesuite.com/truffle) which will provide us a suite of tools for developing Ethereum smart contracts with Solidity programing language.
![](images/truffle.png)

The Truffle Framework provides all the following functionalities: 

* Smart Contract Management
* Automated Testing
* Deployment & Migrations
* Network Management
* Development Console 
 
### **MetaMask** 

Finally we need to install [MetaMask](https://metamask.io) is a web browser extension that allows you to run Ethereum dApps right in your browser without running a full Ethereum node. 

![](images/metamask-1.png)




### **Below we describe our project: CryptoPuppies Marketplace**

![](images/CryptoPuppies_Marketplace.png)

This is a marketplace that runs on the blockchain. It allows individuals to list "CryptoPuppies" for sale and to purchase them on the website with Ethereum in the Ropsten network. This application is powered by a smart contract on the blockchain which manages the market place. For example it tracks who owns the "CryptoPuppy" for sale, and it automatically transfers the ownership of it when a transaction is complete.

![](images/first_demo.gif)

![](images/demo_2.gif)





In case you are interested on buying some CryptoPuppies here is the contract address ```0x9ae7B1d535e82AF09b75E9ADDEBA7239B52498E4```


### **Ropsten Ethereum**

One of our main goals was to be able to run our application on Ropsten Ethereum. Ropsten Ethereum is also known as Ethereum Testnet -- a testing network that runs the same protocol as Ethereum does and is used to testing purposes before deploying on the main network. Using Ropsten to deploy our application allows for greater interactability among users. 

### **Inspiration and Market Trends**

Our inspiration for this project came from our observations of the recent boom in the NFT space. People all over the world are looking to diversify their investment portfolios by offloading their risk exposure to fiat currencies. This trend has been playing out in the cyrptocurrency space as we are already seeing an incredible demand in FTs such as Bitcoin and Ethereum. We believe that this trend will also have an impact on the future of NFTs as more and more people learn about the underlying technology and usages.

![](images/NFT_trends1.png)

### **Project Challenges**

* Integrating our contracts with the front end interface. We had to perform a lot of training to incorporate the front end Node.js code with our Solidity contracts.
* Developing the smart contracts that represent our marketplace and crypto puppy tokens. Specifically creating an NFT that represents the purchased intangible asset.
* Working within the crypto, blockchain network invovled a lot of debugging in order to deploy all of our code completely and accurately.

### **Sources**
* [How To Build A Blockchain App ](https://www.dappuniversity.com/articles/how-to-build-a-blockchain-app#dependencies)
* [Get Ropsten Ethereum](https://medium.com/bitfwd/get-ropsten-ethereum-the-easy-way-f2d6ece21763)
* [Infura](https://infura.io) 
* [Ropsten Ethereum Faucet](https://faucet.ropsten.be)
* [React](https://reactjs.org)
* [OpenZeppelin](https://openzeppelin.com/contracts/)
