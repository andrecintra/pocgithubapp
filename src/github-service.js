const { Octokit } = require("@octokit/core");
const { createAppAuth } = require('@octokit/auth-app');

const fs = require('fs');

require('dotenv').config()

const getOctokit = async () => {

    const pem = fs.readFileSync('./teste-app.2021-10-21.private-key.pem', 'utf8');

    console.log(`Autorizando com Octokit para o app ${process.env.APP_ID}`)

    return new Octokit({
        authStrategy: createAppAuth,
        auth: {
            appId: Number(process.env.APP_ID),
            privateKey: pem,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            installationId: Number(process.env.INSTALLATION_ID)
        },
    });

}

const requestGitApi = async (method, url, body) => {

    const installationOctokit = await getOctokit()

    console.log(`Requisição ${method.toUpperCase()} para ${url}`)

    if (body) {

        console.log("Body da requisição: %j", body)

        return await installationOctokit.request(`${method.toUpperCase()} ${url}`, body)

    }

    return await installationOctokit.request(`${method.toUpperCase()} ${url}`)

}

class GitHubService {

    static async getfile(fileName) {

        try {

            //repo fixo para testes
            return await requestGitApi('get', `/repos/andrecintra/testapp/contents/${fileName}`)

        } catch (error) {

            console.error(error)

        }

    }

    static async saveFile() {

        try {

            const fileBase64 = fs.readFileSync('./myJsonToSave2.json', {encoding: 'base64'});

            console.log("Arquivo a ser salvo: ", fileBase64)

            const body = {
                owner: 'andrecintra',
                repo: 'testapp',
                path: 'src/myJsonToSave2.json',
                message: 'Commit message 2',
                content: fileBase64
              }

            //repo fixo para testes
            return await requestGitApi('put', `/repos/andrecintra/testapp/contents/src/myJsonToSave2.json`, body)

        } catch (error) {

            console.error(error)

        }

    }

}

module.exports = GitHubService