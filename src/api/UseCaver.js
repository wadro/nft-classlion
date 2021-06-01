import Caver from 'caver-js';
import {ACCESS_KEY, SECRET_KEY, CHAIN_ID, BORI_CONTRACT_ADDRESS, COUNT_CONTRACT_ADDRESS} from '../constants'
import BoriABI from '../abi/BoriABI.json'
import CountABI from '../abi/CountABI.json'

const option = {
    headers: [
      {
        name: "Authorization",
        value: "Basic " + Buffer.from(ACCESS_KEY + ":" + SECRET_KEY).toString("base64")
      },
      {
        name: "x-chain-id",
        value: CHAIN_ID
      }
    ]
  }
  
  const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));
  const BoriContract = new caver.contract(BoriABI, BORI_CONTRACT_ADDRESS);
  const CountContract = new caver.contract(CountABI, COUNT_CONTRACT_ADDRESS);
  const privatekey = "0xc89e16e0c336f142db7a21e3693ed734e3db24b784c1bc52a90f0843ee7e558d";
  const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
  caver.wallet.add(deployer);

  export const sendSupport = async (type) => {
    // 현재 고정값, 추후 klip 연동 시 수정
    let supporter = '0x11e9fb7214f22bf1aab84688db89c94dec244757'; 

    // 수혜자 고정, 추후 디벨롭 필요
    let receiver = [
        ['0xea037af4e0daaabc88439a033f9bf7ccc9df7750', '어린이 재단'], // 가칭) 어린이 재단
        ['0x65694221e87711227087266d1052a493741394d7', '고양이 보호 협회'], // 가칭) 고양이 보호 협회
        ['0x6b66afdbb4846b23da8ffeb74f89197accd0c462', '세계보건기구']  // 가칭) 세계보건기구
    ];

    let tokenId = new Date().getTime();
    let tokenURI = 'supporting';

    try {
        const _support = await BoriContract.methods.support(
            supporter, receiver[type][0], tokenId, tokenURI, '0x00'
        ).send({
            from: deployer.address, //address
            value: 10**16,
            gas: "0x4bfd200"
        })
        return receiver[type];

    } catch(e) {
        console.log(e);
        return null;
    }
  }

  export const readCount = async () => {
    // 스마트 컨트랙트 함수 호출
    const _count = await CountContract.methods.count().call();
    console.log(_count);
  }
  
  export const getBalance = async (address) => {
    return await caver.rpc.klay.getBalance(address).then((response) => {
      const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
      return balance;
    })
  }
  
  export const setCount = async (newCount) => {
    // 사용할 account 설정
    try {
      const receipt = await CountContract.methods.setCount(newCount).send({
        from: deployer.address, //address
        gas: "0x4bfd200"
      })
  
      console.log(receipt);
    } catch(e) {
      console.log('error');
    }
  }