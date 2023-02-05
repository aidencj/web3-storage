import {IpfsClient} from './IpfsClient.js'

function printPostInfo(data) {
    console.log(`Author: ${data.author}`);
    console.log(`Title: ${data.title}`);
    console.log(`Context: ${data.context}`);
    console.log(`Emotion: ${data.emotion}`);
}

const ipfsClient = new IpfsClient()
let cid = await ipfsClient.post('0x456', 'The second post', 'Hi everyone!', 'Happy');
let postObject = await ipfsClient.get(cid);
printPostInfo(postObject);
