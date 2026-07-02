
//VARIABLES
const addBtn = document.querySelector('#addBtn');
const cardRow = document.querySelector('.cardsRow');
const inputName = document.querySelector('#rInput');
const quickAddLane = document.querySelector('.quickAdd');
const lanesLoaded = document.querySelector('#lanesLoaded');
const darkBtn = document.querySelector(".darkBrightToggle");
const modeText = document.querySelector("#darkOrBright");
const modeIcon = darkBtn.querySelector("img");

if (localStorage.getItem('quickAdd') == null) {
    const quickAdd = new Array();
    localStorage.setItem('quickAdd', JSON.stringify(quickAdd));
    localStorage.setItem('theme', 'light');
}

restoreCardsFromStorage(cardRow);

//FUNCTIONS
function giveCount(num) {
    if (num < 1000) return `${num}`;
    else if (num < 1000000) return `${num % 1000}K`;
    else if (num < 1000000000) return `${num % 1000000}M`;
    else return `${num % 1000000000}B`;
}

function applyListeners(card) {
    card.addEventListener('click', removeCard);
    card.addEventListener('click', collapseCard);
    card.addEventListener('click', expandCard);
    card.addEventListener('click', starredMarkUnmark);
    card.addEventListener('change', categoryChange);
    card.addEventListener('click', refreshCard);
    card.addEventListener('click', addMorePosts);
    card.addEventListener('click', openPost);
    card.addEventListener('click', copyLink);
}

function givePosts(data, postsInfo, requiredPosts) {
    let fragement = document.createDocumentFragment();

    let loadMore = document.createElement('button');
    loadMore.classList.add('loadMore');
    loadMore.textContent = "load more posts";

    for (const post of data) {

        if (post.id in postsInfo) continue;
        if (requiredPosts == 0) break;

        let p = document.createElement('div');
        p.classList.add('post');
        p.id = post.id;

        p.innerHTML = `
                <p class="category">${post.flair}</p>

                        <div class="topic">${post.title}</div>
                        
                        <small class="subhead">${post.domain}</small>

                        <div class="postBottom">

                            <span class="upvotes"><img src="upArrow.png" alt="" width="10px" height="10px">${giveCount(post.score)}</span>
                            <span class="comments"><img src="comment.png" alt="" width="12px" height="11px">${giveCount(post.num_comments)}</span>
                            <span class="author">u/${post.author}</span>
                            <span class="postTime">${post.created}</span>

                            <img src="star-svgrepo-com.svg" alt="" width="15px" height="15px" class="star">
                            <a href="${post.url}" class="share"><img src="share-svgrepo-com.svg" alt="" width="15px" height="15px"></a>
                        </div>
        `;


        postsInfo[post.id] = {
            "category": post.flair,
            'title': post.title,
            'subhead': post.domain,
            'upvotes': giveCount(post.score),
            'comments': giveCount(post.num_comments),
            'author': post.author,
            'time': post.created,
            "url": post.url,
            "starred": false
        }

        fragement.appendChild(p);
        requiredPosts--;
    };

    fragement.appendChild(loadMore);
    return fragement;
}

function giveSkeletonCard(subredditName) {
    let card = document.createElement('div');
    card.classList.add("card");
    card.classList.add("skeleton");

    card.innerHTML = `
        <div class="infoUtilAndFilters">

                    <div class="infoUtil">

                        <div class="info">    
                        
                            <div class="logoName">
                                <img src="reddit-social-media-communication-network-internet-connection-svgrepo-com.svg" alt=""width="25px" height="25px">
                                <p class="subredditName">${subredditName}</p>
                            </div>

                            <div class="utilities">
                                <img src="up-square-svgrepo-com (1).svg" alt=""  width="12px" height="12px" class="collapse">
                                <img src="refresh-square-2-svgrepo-com.svg" alt=""  width="12px" height="12px" class="refresh">
                                <img src="bin-xmark-fill-svgrepo-com.svg" alt=""  width="12px" height="12px" class="remove">
                            </div>

                        </div>

                        <div class="viewsPosts">
                            
                            <div class="views">
                                 <img src="person-team-svgrepo-com.svg" alt="" width="15px" height="15px"> 
                                 <small class="totalUsers">142K</small>
                            </div>

                            <small class="numberOfPosts">12K posts</small>
                             
                        </div>

                    </div>

                    <select name="filter" class="postFilter">
                        <option value="hot">Hot</option>
                        <option value="new">New</option>
                        <option value="top">Top</option>
                        <option value="rising">Rising</option>
                    </select>

                </div>

                <div class="fetching">Fetching posts...</div>

                <button class="expand">click to expand</button>

                <div class="posts">

                    <div class="starred">
                        
                    </div>

                   <div class="post">

                        <p class="category"></p>

                        <div class="topic">
                            <p class="line1"></p>
                            <p class="line2"></p>
                            <p class="line3"></p>
                        </div>
                        
                        <small class="subhead"></small>

                        <div class="postBottom">

                            <span class="upvotes"></span>
                            <span class="comments"></span>
                            <span class="author"></span>
                            <span class="postTime"></span>

                            <span class="star"></span>
                            <span class="share"></span>
                        </div>

                    </div>

                    <div class="post">

                        <p class="category"></p>

                        <div class="topic">
                            <p class="line1"></p>
                            <p class="line2"></p>
                            <p class="line3"></p>
                        </div>
                        
                        <small class="subhead"></small>

                        <div class="postBottom">

                            <span class="upvotes"></span>
                            <span class="comments"></span>
                            <span class="author"></span>
                            <span class="postTime"></span>

                            <span class="star"></span>
                            <span class="share"></span>
                        </div>

                    </div>

                    <div class="post">

                        <p class="category"></p>

                        <div class="topic">
                            <p class="line1"></p>
                            <p class="line2"></p>
                            <p class="line3"></p>
                        </div>
                        
                        <small class="subhead"></small>

                        <div class="postBottom">

                            <span class="upvotes"></span>
                            <span class="comments"></span>
                            <span class="author"></span>
                            <span class="postTime"></span>

                            <span class="star"></span>
                            <span class="share"></span>
                        </div>

                    </div>

                    <div class="post">

                        <p class="category"></p>

                        <div class="topic">
                            <p class="line1"></p>
                            <p class="line2"></p>
                            <p class="line3"></p>
                        </div>
                        
                        <small class="subhead"></small>

                        <div class="postBottom">

                            <span class="upvotes"></span>
                            <span class="comments"></span>
                            <span class="author"></span>
                            <span class="postTime"></span>

                            <span class="star"></span>
                            <span class="share"></span>
                        </div>

                    </div>

                </div>
    `;

    return card;
}

async function processInput(e) {
    e.preventDefault();
    const subredditName = (e.target.classList.contains('quickAddons')) ? `${e.target.textContent}` : `r/${inputName.value}`;
    if (subredditName == 'r/' || localStorage.getItem(`${subredditName}`) !== null) return;
    const card = giveSkeletonCard(subredditName);
    cardRow.appendChild(card);


    const response = await fetch('./mockData/hot.json');
    const data = await response.json();

    let postsInfo = new Object();
    const fragement = givePosts(data, postsInfo, 5);
    const hotStar = new Object();
    const topStar = new Object();
    const newStar = new Object();
    const risingStar = new Object();

    localStorage.setItem(`${subredditName}`, JSON.stringify({ users: '142K', posts: '12K', category: 'hot', "hotPost": 5, "newPost": 5, "topPost": 5, "risingPost": 5, "postsInfo": postsInfo, "hotStar": hotStar, "topStar": topStar, "newStar": newStar, "risingStar": risingStar }));

    const starredContainer = document.createElement('div');
    starredContainer.classList.add('starred');
    fragement.append(starredContainer);

    await new Promise((resolve) => {
        setTimeout(resolve, 2000);
    })

    const postContainer = card.querySelector('.posts');
    postContainer.innerHTML = "";
    card.classList.remove('skeleton');
    postContainer.appendChild(fragement);

    applyListeners(card);

    let quickAddObj = JSON.parse(localStorage.getItem('quickAdd'));

    if (quickAddObj.includes(subredditName) == false) {

        if (quickAddObj.length == 4) {
            quickAddObj.shift();
            const temp = quickAddLane.querySelector('.quickAddons');
            temp.remove();
        }

        const quickAddon = document.createElement('button');
        quickAddon.classList.add('quickAddons');
        quickAddon.textContent = subredditName;
        quickAddLane.append(quickAddon);

        quickAddObj.push(subredditName);
        localStorage.setItem('quickAdd', JSON.stringify(quickAddObj));

    }

    lanesLoaded.textContent++;
}

function removeCard(e) {

    if (e.target.classList.contains('remove')) {
        const currCard = e.currentTarget;
        const subredditName = currCard.querySelector('.subredditName').textContent;
        localStorage.removeItem(subredditName);
        currCard.remove();
        lanesLoaded.textContent--;
    }
}

function collapseCard(e) {
    if (e.target.classList.contains('collapse')) {
        const currCard = e.currentTarget;
        if (!currCard.classList.contains('collapsed')) currCard.classList.add('collapsed');
    }
}

function expandCard(e) {
    if (e.target.classList.contains('expand')) {
        const currCard = e.currentTarget;
        if (currCard.classList.contains('collapsed')) currCard.classList.remove('collapsed');
    }
}

function starredMarkUnmark(e) {

    if (e.target.classList.contains('star')) {

        const post = e.target.closest('.post');
        const subredditName = e.currentTarget.querySelector('.subredditName').textContent;
        const cardObj = JSON.parse(localStorage.getItem(subredditName));
        const postClicked = cardObj.postsInfo[post.id];
        const category = cardObj.category;

        if (postClicked.starred === false) {

            post.remove();
            post.querySelector('.star').src = 'star-svgrepo-com (1).svg';
            e.currentTarget.querySelector('.starred').append(post);


            if (category == 'hot') cardObj.hotStar[post.id] = postClicked;
            else if (category == 'new') cardObj.newStar[post.id] = postClicked;
            else if (category == 'top') cardObj.topStar[post.id] = postClicked;
            else cardObj.risingStar[post.id] = postClicked;

        }

        else {

            post.remove();
            post.querySelector('.star').src = 'star-svgrepo-com.svg';
            e.currentTarget.querySelector('.posts').append(post);


            if (category == 'hot') delete cardObj.hotStar[post.id];
            else if (category == 'new') delete cardObj.newStar[post.id];
            else if (category == 'top') delete cardObj.topStar[post.id];
            else delete cardObj.risingStar[post.id];

        }

        postClicked.starred = !postClicked.starred;
        localStorage.setItem(e.currentTarget.querySelector('.subredditName').textContent, JSON.stringify(cardObj));


    }

}

function restoreCardsFromStorage(cardRow) {

    const quickAddObj = JSON.parse(localStorage.getItem('quickAdd'));

    for (let i = 0; i < quickAddObj.length; i++) {
        const quickAddon = document.createElement('button');
        quickAddon.classList.add('quickAddons');
        quickAddon.textContent = quickAddObj[i];
        quickAddLane.append(quickAddon);
    }



    for (let i = 0; i < localStorage.length; i++) {

        const key = localStorage.key(i);
        if (key == 'quickAdd' || key == 'theme') continue;
        const cardData = JSON.parse(localStorage.getItem(key));
        const postsObj = cardData.postsInfo;

        const card = document.createElement('div');
        card.classList.add("card");

        card.innerHTML = `
        <div class="infoUtilAndFilters">

                    <div class="infoUtil">

                        <div class="info">    
                        
                            <div class="logoName">
                                <img src="reddit-social-media-communication-network-internet-connection-svgrepo-com.svg" alt=""width="25px" height="25px">
                                <p class="subredditName">${key}</p>
                            </div>

                            <div class="utilities">
                                <img src="up-square-svgrepo-com (1).svg" alt=""  width="12px" height="12px" class="collapse">
                                <img src="refresh-square-2-svgrepo-com.svg" alt=""  width="12px" height="12px" class="refresh">
                                <img src="bin-xmark-fill-svgrepo-com.svg" alt=""  width="12px" height="12px" class="remove">
                            </div>

                        </div>

                        <div class="viewsPosts">
                            
                            <div class="views">
                                 <img src="person-team-svgrepo-com.svg" alt="" width="15px" height="15px"> 
                                 <small class="totalUsers">${cardData.users}</small>
                            </div>

                            <small class="numberOfPosts">${cardData.posts}posts</small>
                             
                        </div>

                    </div>

                    <select name="filter" class="postFilter">
                        <option value="hot">Hot</option>
                        <option value="new">New</option>
                        <option value="top">Top</option>
                        <option value="rising">Rising</option>
                    </select>

                </div>

                <div class="fetching">Fetching posts...</div>

                <button class="expand">click to expand</button>

                <div class="posts">

                    <div class="starred">
                        
                    </div>

                   
                    <button class="loadMore">load more posts</button>
                </div>
    `;


        if (cardData.category == 'hot') card.querySelector('.postFilter').value = 'hot';
        else if (cardData.category == 'new') card.querySelector('.postFilter').value = "new";
        else if (cardData.category == 'top') card.querySelector('.postFilter').value = "top";
        else card.querySelector('.postFilter').value = "rising";

        for (const postId in postsObj) {

            const post = postsObj[postId];
            const p = document.createElement('div');
            p.classList.add('post');
            p.id = postId;


            p.innerHTML = `
                <p class="category">${post.category}</p>

                        <div class="topic">${post.title}</div>
                            
                        <small class="subhead">${post.subhead}</small>

                        <div class="postBottom">

                            <span class="upvotes"><img src="upArrow.png" alt="" width="10px" height="10px">${post.upvotes}</span>
                            <span class="comments"><img src="comment.png" alt="" width="12px" height="11px">${post.comments}</span>
                            <span class="author">u/${post.author}</span>
                            <span class="postTime">${post.time}</span>

                            <img src="star-svgrepo-com.svg" alt="" width="15px" height="15px" class="star">
                            <a href="${post.url}" class="share"><img src="share-svgrepo-com.svg" alt="" width="15px" height="15px"></a>
                        </div>
                    `;

            if (post.starred) {
                p.querySelector('.star').src = "star-svgrepo-com (1).svg";
                card.querySelector('.starred').append(p);
            }

            else card.querySelector('.posts').append(p);

        }


        let categoryPostLoaded = 0;
        if (cardData.category == 'hot') categoryPostLoaded = cardData.hotPost;
        else if (cardData.category == 'top') categoryPostLoaded = cardData.topPost;
        else if (cardData.category == 'new') categoryPostLoaded = cardData.newPost;
        else categoryPostLoaded = cardData.risingPostPost;

        if (categoryPostLoaded == 10) card.classList.add('allPostsLoaded');
        else card.classList.remove('allPostsLoaded');

        applyListeners(card);

        cardRow.append(card);

        lanesLoaded.textContent++;
    }


    if (localStorage.getItem("theme") == "dark") {

        document.body.classList.add("dark");

        modeText.textContent = "Dark";
        modeIcon.src = "moon.svg";

    }
}

async function categoryChange(e) {

    if (e.target.classList.contains('postFilter') == false && e.target.classList.contains('refresh') == false) return;

    const subredditName = e.currentTarget.querySelector('.subredditName').textContent;
    let cardObj = JSON.parse(localStorage.getItem(subredditName));

    if (e.target.classList.contains('postFilter')) cardObj.category = e.target.value;

    let starObj;
    if (cardObj.category == 'hot') starObj = cardObj.hotStar;
    else if (cardObj.category == 'top') starObj = cardObj.topStar;
    else if (cardObj.category == 'new') starObj = cardObj.newStar;
    else starObj = cardObj.risingStar;

    let currCard = e.currentTarget;
    currCard.classList.add('skeleton');
    currCard.innerHTML = giveSkeletonCard(subredditName).innerHTML;

    if (cardObj.category == 'hot') currCard.querySelector('.postFilter').value = 'hot';
    else if (cardObj.category == 'new') currCard.querySelector('.postFilter').value = "new";
    else if (cardObj.category == 'top') currCard.querySelector('.postFilter').value = "top";
    else currCard.querySelector('.postFilter').value = "rising";

    let fragement = document.createDocumentFragment();
    let starredContainer = document.createElement('div');
    starredContainer.classList.add('starred');

    let newPostInfo = new Object();

    for (const key in starObj) {

        const postObj = starObj[key];
        const p = document.createElement('div');
        p.classList.add('post');
        p.id = key;

        p.innerHTML = `
            <p class="category">${postObj.category}</p>

                    <div class="topic">${postObj.title}</div>
                        
                      <small class="subhead">${postObj.subhead}</small>

                    <div class="postBottom">

                        <span class="upvotes"><img src="upArrow.png" alt="" width="10px" height="10px">${postObj.upvotes}</span>
                        <span class="comments"><img src="comment.png" alt="" width="12px" height="11px">${postObj.comments}</span>
                        <span class="author">u/${postObj.author}</span>
                        <span class="postTime">${postObj.time}</span>

                        <img src="star-svgrepo-com (1).svg" alt="" width="15px" height="15px" class="star">
                        <a href="${postObj.url}" class="share"><img src="share-svgrepo-com.svg" alt="" width="15px" height="15px"></a>
                    </div>
                `;

        starredContainer.append(p);

        newPostInfo[key] = {
            "category": postObj.category,
            'title': postObj.title,
            'subhead': postObj.subhead,
            'upvotes': postObj.upvotes,
            'comments': postObj.comments,
            'author': postObj.author,
            'time': postObj.time,
            "url": postObj.url,
            "starred": true
        }

    }

    fragement.append(starredContainer);

    let categoryPostLoaded = 0;
    if (e.target.classList.contains('refresh')) categoryPostLoaded = 5;
    else if (cardObj.category == 'hot') categoryPostLoaded = cardObj.hotPost;
    else if (cardObj.category == 'top') categoryPostLoaded = cardObj.topPost;
    else if (cardObj.category == 'new') categoryPostLoaded = cardObj.newPost;
    else categoryPostLoaded = cardObj.risingPost;

    if (Object.keys(starObj).length < categoryPostLoaded) {
        const response = await fetch(`./mockData/${cardObj.category}.json`);
        const data = await response.json();
        const postsFragement = givePosts(data, newPostInfo, categoryPostLoaded - Object.keys(starObj).length);
        fragement.append(postsFragement);
    }
    else {
        let loadMore = document.createElement('button');
        loadMore.classList.add('loadMore');
        loadMore.textContent = "load more posts";
        fragement.append(loadMore);
    }

    if (categoryPostLoaded == 10) currCard.classList.add('allPostsLoaded');
    else currCard.classList.remove('allPostsLoaded');

    cardObj.postsInfo = newPostInfo;

    if (e.target.classList.contains('refresh')) {
        if (cardObj.category == 'hot') cardObj.hotPost = 5;
        else if (cardObj.category == 'top') cardObj.topPost = 5;
        else if (cardObj.category == 'new') cardObj.newPost = 5;
        else cardObj.risingPost = 5;
    }

    localStorage.setItem(subredditName, JSON.stringify(cardObj));

    await new Promise((resolve) => { setTimeout(resolve, 500) });

    currCard.classList.remove('skeleton');
    currCard.querySelector('.posts').innerHTML = "";
    currCard.querySelector('.posts').append(fragement);


}

async function refreshCard(e) {
    if (e.target.classList.contains('refresh') == false) return;
    await categoryChange(e);//keeping same category
}

async function addMorePosts(e) {

    if (e.target.classList.contains('loadMore') == false) return;

    const subredditName = e.currentTarget.querySelector('.subredditName').textContent;
    const cardObj = JSON.parse(localStorage.getItem(subredditName));
    const card = e.currentTarget;

    const response = await fetch(`./mockData/${cardObj.category}.json`);
    const data = await response.json();

    let categoryPostLoaded = 0;

    if (cardObj.category == 'hot') categoryPostLoaded = cardObj.hotPost;
    else if (cardObj.category == 'top') categoryPostLoaded = cardObj.topPost;
    else if (cardObj.category == 'new') categoryPostLoaded = cardObj.newPost;
    else categoryPostLoaded = cardObj.risingPost;

    if (data.length == categoryPostLoaded) return;

    let toLoad = 2;
    let fragement = document.createDocumentFragment();

    for (const post of data) {

        if (toLoad == 0) break;
        if (post.id in cardObj.postsInfo) continue;

        let p = document.createElement('div');
        p.classList.add('post');
        p.id = post.id;

        p.innerHTML = `
                <p class="category">${post.flair}</p>

                        <div class="topic">${post.title}</div>
                        
                        <small class="subhead">${post.domain}</small>

                        <div class="postBottom">

                            <span class="upvotes"><img src="upArrow.png" alt="" width="10px" height="10px">${giveCount(post.score)}</span>
                            <span class="comments"><img src="comment.png" alt="" width="12px" height="11px">${giveCount(post.num_comments)}</span>
                            <span class="author">u/${post.author}</span>
                            <span class="postTime">${post.created}</span>

                            <img src="star-svgrepo-com.svg" alt="" width="15px" height="15px" class="star">
                            <a href="${post.url}" class="share"><img src="share-svgrepo-com.svg" alt="" width="15px" height="15px"></a>
                        </div>
        `;


        cardObj.postsInfo[post.id] = {
            "category": post.flair,
            'title': post.title,
            'subhead': post.domain,
            'upvotes': giveCount(post.score),
            'comments': giveCount(post.num_comments),
            'author': post.author,
            'time': post.created,
            "url": post.url,
            "starred": false
        }

        fragement.appendChild(p);
        categoryPostLoaded++;
        toLoad--;
    }

    if (data.length == categoryPostLoaded) card.classList.add('allPostsLoaded');


    if (cardObj.category == 'hot') cardObj.hotPost = categoryPostLoaded;
    else if (cardObj.category == 'top') cardObj.topPost = categoryPostLoaded;
    else if (cardObj.category == 'new') cardObj.newPost = categoryPostLoaded;
    else cardObj.risingPost = categoryPostLoaded;

    card.querySelector('.posts').append(fragement);
    localStorage.setItem(subredditName, JSON.stringify(cardObj));
}

function addFromQuickAdd(e) {

    if (e.target.classList.contains('quickAddons') == false) return;

    processInput(e);
}

function openPost(e) {

    if (!e.target.classList.contains('topic')) return;

    const post = e.target.closest('.post');
    const subreddit = e.currentTarget.querySelector('.subredditName').textContent;

    const cardObj = JSON.parse(localStorage.getItem(subreddit));

    window.open(cardObj.postsInfo[post.id].url, "_blank");

}

async function copyLink(e) {

    if (!e.target.closest('.share')) return;

    e.preventDefault();

    const post = e.target.closest('.post');
    const subreddit = e.currentTarget.querySelector('.subredditName').textContent;

    const cardObj = JSON.parse(localStorage.getItem(subreddit));

    const url = cardObj.postsInfo[post.id].url;

    await navigator.clipboard.writeText(url);

    alert("Link copied!");
}

function toggleTheme() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        modeText.textContent = "Dark";
        modeIcon.src = "moon.svg";

    }

    else {

        modeText.textContent = "Light";
        modeIcon.src = "sun.svg";

    }

    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");

}

//local storage ->>   subredditName: {users,posts,category, postsInfo:{ id: {category,title,subhead,upvotes,comments,author,time,starred,url} }, hotStar,newStar,topStar,risingStar, hotPost,newPost,topPost,risingPost,  };


//EVENT LISTENERS
addBtn.addEventListener('click', processInput);
inputName.addEventListener('keydown', (e) => {
    if (e.key == "Enter") processInput(e);
});
quickAddLane.addEventListener('click', addFromQuickAdd);
darkBtn.addEventListener("click", toggleTheme);



