const {
    client,
    getAllUsers,
    createUser,
    updateUser
  } = require('./index');
 
  
async function createInitialUsers() {
    try {
        console.log('Starting to creat users...');

        const albert = await createUser({username: 'albert', password: 'bertie99', name: 'Albert Bany', location: 'Albany'});

        const sandra = await createUser({username: 'Sandra', password: '2sandy4me', name: 'Sandra Bullock', location: 'The beach'});

        const glamgal = await createUser({username: 'glamgal', password: 'soglam', name: 'Barthalomew', location: 'Glamville'});

        console.log(albert, sandra, glamgal);

        console.log('Finished creating user!');
    } catch(error) {
        console.log("Error creating users!");
        throw error;
    }
}

async function dropTables() {
    try {
      console.log("Starting to drop tables...");
  
      await client.query(`
        DROP TABLE IF EXISTS users;
      `);
  
      console.log("Finished dropping tables!");
    } catch (error) {
      console.error("Error dropping tables!");
      throw error;
    }
}
  
async function createTables() {
    try {
      console.log("Starting to build tables...");
  
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL,
          name varchar(255) NOT NULL,
          location varchar(255),
          active BOOLEAN DEFAULT true
        );
      `);
  
      console.log("Finished building tables!");
    } catch (error) {
      console.error("Error building tables!");
      throw error;
    }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    await createPost({
      authorId: albert.id,
      title: "First Post",
      content: "This is my first post. I hope I love writing blogs as much as I love writing them."
    });

    await createPost({
      authorId: sandra.id,
      title: "First Post",
      content: "This is my first post. I hope I love writing blogs as much as I love the beach."
    });

    await createPost({
      authorId: glamgal.id,
      title: "First Post",
      content: "This is my first post. I hope I love writing blogs as much as I love being glamorous."
    });
  } catch(error) {
    throw error;
  }
}
  
async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
      await createInitialPosts();
    } catch (error) {
      throw error;
    }
}
  
async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY"
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content"
    });
    console.log("Result:", updatePostResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}
  
  
rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());