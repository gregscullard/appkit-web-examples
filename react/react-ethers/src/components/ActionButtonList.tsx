import { useDisconnect, useAppKit, useAppKitNetwork, useAppKitAccount, useAppKitProvider, useAppKitNetworkCore, type Provider  } from '@reown/appkit/react'
import {BrowserProvider, JsonRpcSigner, parseUnits, formatEther, ContractFactory, Contract} from 'ethers'
import { networks } from '../config'
import {abi, bytecode} from "../config/contract.ts";
import {useState} from "react";

// test transaction
const TEST_TX = {
  to: "0x00000000000000000000000000000000002199C8",  // account id 0.2202056
  value: parseUnits('10000000000', 'wei') // 1 tinybar
}

interface ActionButtonListProps {
  sendHash: (hash: string ) => void;
  sendSignMsg: (hash: string) => void;
  sendBalance: (balance: string) => void;
  sendContractAddress: (contractAddress: string) => void;
}

export const ActionButtonList =  ({ sendHash, sendSignMsg, sendBalance, sendContractAddress }: ActionButtonListProps) => {
    const { disconnect } = useDisconnect();
    const { open } = useAppKit();
    const { chainId } = useAppKitNetworkCore();
    const { switchNetwork } = useAppKitNetwork();
    const { isConnected,address } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider<Provider>('eip155')
    const [ contractAddress, setContractAddress ] = useState("")

    const handleDisconnect = async () => {
      try {
        await disconnect();
      } catch (error) {
        console.error("Failed to disconnect:", error);
      }
    };

    // function to send a tx
    const handleSendTx = async () => {
      sendHash("");
      if (!walletProvider || !address) throw Error('user is disconnected');

      const provider = new BrowserProvider(walletProvider, chainId);
      const signer = new JsonRpcSigner(provider, address)

      const tx = await signer.sendTransaction(TEST_TX);
      await tx.wait(); // This will wait for the transaction to be mined

      sendHash(tx.hash);
    }

    // function to deploy a contract
    const handleDeployContract = async () => {
        if (!walletProvider || !address) throw Error('user is disconnected');

        const provider = new BrowserProvider(walletProvider, chainId);
        const signer = new JsonRpcSigner(provider, address)

        const factory = new ContractFactory(abi, bytecode, signer);
        const contract = await factory.deploy("test2", {
                    gasLimit: 150000,
                });

        console.log(`Stateful contract deployed at ${contract.target}`);
        const deployedToAddress: string = await contract.getAddress();
        setContractAddress(deployedToAddress);
        sendContractAddress(deployedToAddress);
    }

    const handleExecuteContract = async () => {
        sendHash("");
        if (!walletProvider || !address) throw Error('user is disconnected');
        if (!contractAddress) throw Error('no contract deployed');

        const provider = new BrowserProvider(walletProvider, chainId);
        const signer = new JsonRpcSigner(provider, address)

        const contract = new Contract(contractAddress, abi, provider);
        const contractWithSigner = contract.connect(signer);

        const tx = await contractWithSigner.set_message("A message", {
            gasLimit: 100001,
        });
        console.log("Transaction sent, waiting for confirmation...");
        await tx.wait()

        sendHash(tx.hash);
    }
    // function to sing a msg
    const handleSignMsg = async () => {
      if (!walletProvider || !address) throw Error('user is disconnected');

      const provider = new BrowserProvider(walletProvider, chainId);
      const signer = new JsonRpcSigner(provider, address);
      const sig = await signer?.signMessage('Hello Reown AppKit!');

      sendSignMsg(sig);
    }

    // function to get the balance
    const handleGetBalance = async () => {
      if (!walletProvider || !address) throw Error('user is disconnected')

      const provider = new BrowserProvider(walletProvider, chainId)
      const balance = await provider.getBalance(address);
      const eth = formatEther(balance);
      sendBalance(`${eth} ETH`);
    }
  return (
    <div >
      {isConnected ? (
        <div>
          <button onClick={() => open()}>Open</button>
          <button onClick={handleDisconnect}>Disconnect</button>
          <button onClick={() => switchNetwork(networks[1]) }>Switch</button>
          <button onClick={handleSignMsg}>Sign msg</button>
          <button onClick={handleSendTx}>Send tx</button>
          <button onClick={handleGetBalance}>Get Balance</button>
          <button onClick={handleDeployContract}>DeployContract</button>
          <button onClick={handleExecuteContract}>Exec Contract</button>
        </div>
      ) : null}
    </div>
  )
}
