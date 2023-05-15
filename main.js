import fs from 'node:fs/promises';

// LEV I

export const backup = async () => {

    try {
        await fs.stat('./data');

    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.mkdir('./data')
        } else {
            console.error(error.message);
        }
    }

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const json = await response.json()
        console.log(json);

        //hier haben wir gemapt, ist aber wohl nicht nötig, SIEHE UNTEN
        // await fs.appendFile('./data/posts.json', `${json.map((element) => {
        //     return JSON.stringify({
        //         userId: element.userId,
        //         id: element.id,
        //         title: element.title,
        //         body: element.body
        //     }, null, 2)
        // })}`)

        await fs.writeFile('./data/posts.json', JSON.stringify(json, null, 2))
        return json
    } catch (error) {
        console.error("Das war nix!", error)
    }

}
backup().then((resp) => console.log(resp))


// LEV II

export const comments = async () => {
    let newComArr = [];

    for (let index = 0; index <= 100; index++) {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${index}/comments`);
        const jsonComments = await response.json()
        console.log(jsonComments);

        // destructering mit push und spread operator ... 
        newComArr.push(...jsonComments)

        // oder .concat
        // newComArr = newComArr.concat(jsonComments)
    }
    await fs.writeFile('./data/comments.json', JSON.stringify(newComArr, null, 2))

    // try {
    //     await fs.appendFile('./data/posts.json', `comments: ${JSON.stringify(newComArr, null, 2)}`)
    // } catch (error) {
    //     console.log(error);
    // }
}
comments().then((resp) => console.log(resp))

// LEV III


export const allTogether = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const json = await response.json();
        console.log(json);

        let newComArr = [];

        for (let index = 0; index <= 100; index++) {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${index}/comments`);
            const jsonComments = await response.json()
            console.log(jsonComments);

            newComArr.push(...jsonComments)
        }

        const data = json.map(post => {
            const comments = newComArr.filter(comment => comment.postId === post.id);
            return { ...post, comments };
        });

        await fs.writeFile('./data/posts.json', `${JSON.stringify(data, null, 2)}`)
    }
    catch (error) {
        console.log(error);
    }
}
allTogether().then((resp) => console.log(resp))