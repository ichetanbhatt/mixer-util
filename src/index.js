'use strict';
const fs = require('fs');
const path = require('path');
const MIXER = require('@mixer/client-node');

const client = new MIXER.Client(new MIXER.DefaultRequestRunner());

const execLocation = process.argv[1]
const clientId = process.argv[2]
const channelName = process.argv[3];

if (!clientId || !channelName) {
    throw Error("Please provide 'clientId' 'channelName'")
}

console.log(process.argv)
client.use(new MIXER.OAuthProvider(client, {
    clientId,
}));


client.request('GET', `channels/${channelName}`)
    .then(res => {
        const userId = res.body.id
        client.request('GET', `/channels/${userId}/manifest.m3u8`)
            .then(res => {
                let streamData = JSON.stringify(res.body);
                streamData = streamData.replace(/\\n/g, '\r\n')
                streamData = streamData.substring(1, streamData.length - 1)
                fs.writeFileSync(path.join(__dirname, 'stream.m3u8'), streamData);
            });
    });


