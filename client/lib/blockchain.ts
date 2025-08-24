import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import contractArtifact from '../../build/contracts/SystemIntegrity.json';

const PRIVATE_KEY="0x11801d50acb2f19d36d83186500b042750abbe7aaf37cd443ce23672e42c57f6"
 const CONTRACT_ADDRESS="0xB038b8896ebEEA6e6a2A0043A1e9e1CA73Ad9380"
 const GANACHE_URL="http://127.0.0.1:7545"

if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error('Missing required environment variables');
}

const web3 = new Web3(GANACHE_URL);
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

const contract = new web3.eth.Contract(
  contractArtifact.abi as AbiItem[],
  CONTRACT_ADDRESS
);

export async function getStoredHash(): Promise<string> {
  return await contract.methods.getHash().call();
}

export async function storeHash(hash: string): Promise<void> {
  await contract.methods.storeHash(hash).send({
    from: account.address,
   
  });
}

export async function verifyHash(currentHash: string): Promise<boolean> {
  const storedHash = await getStoredHash();
  return storedHash === currentHash;
}