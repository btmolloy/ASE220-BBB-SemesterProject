const id = getAllUrlParams().id;
//console.log(id);

let username;

api.GET_ITEM("Users", id, async function(response) {
    username = response[0].username;
    await axios.get(`${api.endpoint}getuserid/Users/${response[0].username}`,{}).then(function(res){
        $("title").text("BBB Music - " + response[0].username);
        $(".pageTitle").text(response[0].username);
        $(".profileImg").attr("src", `images/${res.data[0].profileImg}`);
        $("#username").text(response[0].username);
        $("#bio").text(response[0].bio);
        fillProfilePosts();
    })

    api.GET_USER(document.cookie.split("=")[1], function(response) {
        if (response.username == username) {
            $(".editProfileImg").html(`
                <p>
                    <a class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    Change Profile Picture
                    </a>
                </p>
                <div class="collapse" id="collapseExample">
                    <div class="card card-body">
                        <div class="profile-img-container profileImgCard" profileImg="0">
                            <img src="images/profile_img_1.png" height="50px" width="50px" style="vertical-align: middle; cursor: pointer;" id="profile-img_1" onclick="selectItem(1)">
                            <img src="images/profile_img_2.png" height="50px" width="50px" style="vertical-align: middle; cursor: pointer;" id="profile-img_2" onclick="selectItem(2)">
                            <img src="images/profile_img_3.png" height="50px" width="50px" style="vertical-align: middle; cursor: pointer;" id="profile-img_3" onclick="selectItem(3)">
                            <img src="images/profile_img_4.png" height="50px" width="50px" style="vertical-align: middle; cursor: pointer;" id="profile-img_4" onclick="selectItem(4)">
                            <img src="images/profile_img_5.png" height="50px" width="50px" style="vertical-align: middle; cursor: pointer;" id="profile-img_5" onclick="selectItem(5)">
                            <img src="images/profile_img_6.png" height="50px" width="50px" style="vertical-align: middle; cursor: pointer;" id="profile-img_6" onclick="selectItem(6)">
                            <img src="images/profile_img_7.png" height="50px" width="50px" style="vertical-align: middle; cursor: pointer;" id="profile-img_7" onclick="selectItem(7)">
                            <img src="images/profile_img_8.png" height="50px" width="50px" style="vertical-align: middle; cursor: pointer;" id="profile-img_8" onclick="selectItem(8)">
                            <a class="btn btn-primary" onclick="updateProfilePicture()">Save Changes</a>
                        </div>
                    </div>
                </div>
            `);
        }
    });
})

function fillProfilePosts() {
    api.GET("Posts", async function(res) {
        res.data.forEach(function(response) {
            if (response.username == username) {
                var newPost = `
                <div class="row">
                    <div class="card col-12 border-dark my-3" style="background: #ccc; margin-bottom: 2em;">
                        <div class="card-header border-dark">${response.username}</div>
                        <div class="card-body text-dark">
                            <h5 class="card-title">${response.title}</h5>
                            <p class="card-text">${response.rating} out of 10</p>
                        </div>
                        <div class="card-footer bg-transparent border-dark">
                            ${response.timestamp}
                            <a class="btn btn-primary" style="float: right;" onclick="location.href ='post?id=${response.id}';">View Post</a>
                        </div>
                    </div>
                </div>`;
            //adds new post to page
            $("#post-list").append(newPost);
            }
        })
    })
}

function selectItem(item) {
    $(".profileImgCard").attr("profileImg", item)
    let counter = 1;
    while(counter <= 8) {
        $(`#profile-img_${counter}`).attr("style", "vertical-align: middle; cursor: pointer;");
        counter++;
    }
    $(`#profile-img_${item}`).attr("style", "background: #fd9f57; width: 65px; height: 65px; border-radius: 50%; vertical-align: middle; cursor: pointer;")
    console.log($(".profileImgCard").attr("profileImg"))
}

function updateProfilePicture() {
    let img = ($(".profileImgCard").attr("profileImg"))
    img = `profile_img_${img}.png`
    let newImg = {
        profileImg: img
    }

    api.PUT("Users",newImg,id,"editUser",function(response){
    })

    document.location.reload();
}

function signEvent(){
    const element = $('.signStatus').text();
    if (element.includes('Sign Out')) {
        deleteCookies();
        // alertUser("User logged out");
        document.location.reload();
    }
    if (element.includes('Sign In')) {
        document.location.href = 'user'
    }
}

//Function for clearing cookies
function deleteCookies() {
    var allCookies = document.cookie.split(';');
    
    // The "expire" attribute of every cookie is 
    // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
    for (var i = 0; i < allCookies.length; i++)
        document.cookie = allCookies[i] + "=;expires="
        + new Date(0).toUTCString();
}

//check if a user is signed in
function checkSignedIn() {
    if (document.cookie.split("=")[1]) {
        api.GET_USER(document.cookie.split("=")[1], function(response) {
            axios.get(`${api.endpoint}getuserid/Users/${response.username}`,{}).then(function(res){
                $(".profileIMG").attr("src", `images/${res.data[0].profileImg}`);
                $(".profileIMG").attr("onclick", `location.href='profile?id=${res.data[0]._id}'`)
                $(".profileUsername").text(response.username)
            })
        })
    }
}

//Go to Own Profile Function
function goToSelfProfile(){
    let selfID
    let cookie = document.cookie.split("=")[1]
    if(cookie){
        api.GET_USER(cookie, function(response) {
            selfID = response._id;
            document.location.href = `profile?id=${selfID}`;
        });
    }
    else{
        window.location.href = 'user';
    }

}

function goHome(){
    document.location.href = '/'
}

function goTermsConditions(){
    document.location.href = '/Terms&Conditions';
}
function goAboutUs(){
    document.location.href = '/aboutUs';
}