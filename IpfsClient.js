import { Web3Storage, getFilesFromPath } from 'web3.storage';
import { readFileSync, writeFileSync, unlink } from 'fs';

export class IpfsClient {
    constructor() {
        const config = JSON.parse(readFileSync('./config.json', 'utf8'));
        const token = config.WEB3_STORAGE_TOKEN;
        this.client = new Web3Storage({ token });
    }

    /**
     * Uploads files to web3.storage
     * @param {string} path The path to the file.
     * @return {Promise<CIDString>} Returns the corresponding Content Identifier (CID).
     */
    async put(path) {
        let file = await getFilesFromPath(path)
        let cid = await this.client.put(file)
        return cid;
    }

    /**
     * Fetch the post object by its CID.
     * @param {CIDString} cid The Content Identifier (CID) of the post.
     * @return {object} Returns the post object,
     * which contains {"author", "title", "context", "emotion"}
     */
    async get(cid) {
        let res = await this.client.get(cid); // Web3Response
        let files = await res.files(); // Web3File[]
        let rawData = await files[0].text();
        return JSON.parse(rawData);
    }

    /**
     * Upload a post to web3.storage
     * @param {string} author The address of the author.
     * @param {string} title The title of the post.
     * @param {string} context The context of the post.
     * @param {string} emotion The emotion of the post.
     * @return {Promise<CIDString>} Returns the corresponding Content Identifier (CID).
     */
    async post(author, title, context, emotion){
        let postObject = {
            "author": author,
            "title": title,
            "context": context,
            "emotion": emotion
        }
        let rawData = JSON.stringify(postObject, null, 2);
        let filename = `temp_${author}.json`;
        writeFileSync(filename, rawData);
        let cid = await this.put(filename);
        console.log(`Put ${author}'s post (${title}) to IPFS.`)
        console.log(`CID: ${cid}`)
        unlink(filename, (err) => {
            if (err) throw err;
        });
        return cid;
    }
}
