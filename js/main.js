//1
function createElemWithText(html_element = 'p', text_content = "", class_name) {

    const elem = document.createElement(html_element);

    elem.textContent = text_content;

    if (class_name) {
        elem.classList.add(class_name);
    }

    return elem;
}
//2
function createSelectOptions(users) {
    if (users == undefined) return;

    let returnArray = [];

    for (var i = 0; i < users.length; i++) {

        let elem = document.createElement("option");

        elem.setAttribute("value", users[i].id);
        elem.textContent = users[i].name;

        returnArray.push(elem);

    }

    return returnArray;
}
//3
function toggleCommentSection(postId) {
    if (!postId) return;
  
      let element = document.querySelector(`section[data-post-id="${postId}"]`);

      if (element) element.classList.toggle("hide");

      return element;
  
}

//4
function toggleCommentButton(postID) {

    if (!postID) return;

    const buttonToggled = document.querySelector(`button[data-post-id = "${postID}"`);

    if (buttonToggled != null) {
        buttonToggled.textContent === "Show Comments" ? (buttonToggled.textContent = "Hide Comments") : (buttonToggled.textContent = "Show Comments");
    }

    return buttonToggled;
};

// 5
function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement)) return;

    let child = parentElement.lastElementChild;

    while (child) {

        parentElement.removeChild(child);
        child = parentElement.lastElementChild;

    }

    return parentElement;
}
// 6
const addButtonListeners = () => {
    let myMainElem = document.querySelector('main')
    let buttonsList = myMainElem.querySelectorAll('button')

    if (buttonsList) {

        for (let i = 0; i < buttonsList.length; i++) {

            let myButton = buttonsList[i]
            let postId = myButton.dataset.postId

            myButton.addEventListener('click', function(event) {
                toggleComments(event, postId), false
            })

        }

        return buttonsList
    }

}


// 7

function removeButtonListeners() {
    var buttons = document.querySelector("main").querySelectorAll("button");

    buttons.forEach((button) => {

        button.removeEventListener(
            "click",
            function(e) {
                toggleComments(e, button.dataset.postId);
            },
            false
        );

    });

    return buttons;
}

//8
function createComments(comments) {
    if (!comments) return;

    let fragment = document.createDocumentFragment();

    comments.forEach((comment) => {

        let article = document.createElement("article");

        article.append(createElemWithText("h3", comment.name));
        article.append(createElemWithText("p", comment.body));
        article.append(createElemWithText("p", `From: ${comment.email}`));

        fragment.append(article);

    });
    return fragment;
}

//9
function populateSelectMenu(users) {

    if (!users) return;

    let menu = document.querySelector("#selectMenu");

    let options = createSelectOptions(users);

    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        menu.append(option);
    }

    return menu;

}

//10
const getUsers = async () => {

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/`);
        const userPosts = await response.json();
        return userPosts;
    } catch (error) {
        console.log(error);
    }
}
//11
const getUserPosts = async (userId) => {
    if (!userId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
        const userPosts = await response.json();
        return userPosts;
    } catch (error) {
        console.log(error);
    }
}
//12
const getUser = async (userId) => {
    if (!userId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const user = await response.json();
        return user;
    } catch (error) {
        console.log(error);
    }
}

//13
const getPostComments = async (postId) => {
    if (!postId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const jsonPostComments = await response.json();
        return jsonPostComments;
    } catch (error) {
        console.log(error);
    }
}

//14

const displayComments = async (postId) => {
    if (!postId) return;

    let section = document.createElement("section");

    section.dataset.postId = postId;
    section.classList.add("comments", "hide");

    const comments = await getPostComments(postId);
    const fragment = createComments(comments);

    section.append(fragment);

    return section;
}




//15
const createPosts = async (jsonPosts) => {
    if (!jsonPosts) return;

    let fragment = document.createDocumentFragment();

    for (let i = 0; i < jsonPosts.length; i++) {

        let post = jsonPosts[i];

        let article = document.createElement("article");
        let section = await displayComments(post.id);
        let author = await getUser(post.userId);

        let h2 = createElemWithText("h2", post.title);
        let p = createElemWithText("p", post.body);
        let p2 = createElemWithText("p", `Post ID: ${post.id}`);

        let p3 = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
        let p4 = createElemWithText("p", `${author.company.catchPhrase}`);

        let button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;

        article.append(h2, p, p2, p3, p4, button, section);

        fragment.append(article);
    }

    return fragment;
};

// #16
const displayPosts = async (posts) => {

    let myMain = document.querySelector("main");
    let element = (posts) ? await createPosts(posts) : document.querySelector("main p");

    myMain.append(element);
    
    return element;
}


// #17
function toggleComments(event, postId) {
    if (!event || !postId) return;

    event.target.listener = true;

    let section = toggleCommentSection(postId);
    let button = toggleCommentButton(postId);

    return [section, button];
}


// 18
const refreshPosts = async (posts) => {
    if (!posts || posts == null) return undefined;
    
    let mainElem = document.querySelector("main")

    let buttons = removeButtonListeners();
    let mainRes = deleteChildElements(mainElem);
    let postsRes = await displayPosts(posts);
    let button = addButtonListeners();

    return [buttons, mainRes, postsRes, button];
}

// 19
async function selectMenuChangeEventHandler(e) {
    if (!e) return undefined;
    let userId = e?.target?.value || 1;
    let posts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts(posts);

    return [userId, posts, refreshPostsArray];
}

// 20
const initPage = async () => {
    let users = await getUsers();
    let select = populateSelectMenu(users);

    return [users, select];
}

// 21
function initApp() {
    initPage();
    let select = document.getElementById("selectMenu");
    select.addEventListener("change", selectMenuChangeEventHandler);
}

document.addEventListener("DOMContentLoaded", initApp);
