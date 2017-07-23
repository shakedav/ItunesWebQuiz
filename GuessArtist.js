
//Public Variables
var artistIds = [360391, 32940, 106621, 3996865, 94804, 727711, 1248588, 487143, 17973, 155814, 1092859, 135532, 217005, 13952, 471744, 95966, 133557, 112018, 152016];
var TOTALGUESSES = 2;
var TOTALROUNDS = 5;
var attemptNumber = 1;
var points = 0;
var gameArtistName = '';
var roundNumber = 0;

$(document).ready(function () {
    GetAlbumsFromItunes();
    $('#albums').show();
    $('#sendGuess').click(function () {
        SendGuess();
    });
    $('#nameOfArtist').keypress(function (e) {
        var key = e.which;
        if (key == 13) // User pressed the enter key
        {
            SendGuess();
        }
    });
});

function handleGuess(isCorrectGuess)
{
    if (isCorrectGuess)
    {
        $('#correct').show();
        setTimeout(function () {
            $("#correct").hide();
            switch (attemptNumber) {
                case 1:
                    {
                        points += 5;
                        break;
                    }
                case 2:
                    {
                        points += 3;
                        break;
                    }
                case 3:
                    {
                        points += 1;
                        break;
                    }
            }
            attemptNumber++;
            if (roundNumber < TOTALROUNDS) {
                attemptNumber = 1;
                GetAlbumsFromItunes();
            }
            else {
                DisplayEndOfGame();
            }          
        }, 700);    
    }
    else
    {
        $('#wrong').show()
        setTimeout(function () {
            $("#wrong").fadeOut();
            DisplayNextStep(attemptNumber);
            attemptNumber++;
            DisplayPointsNum();
        }, 700);                
        if (roundNumber > TOTALROUNDS) {        
            DisplayEndOfGame();
        }
    }
    $('#nameOfArtist').val('');
}

function DisplayEndOfGame()
{
    $('#albums').hide();
    $('#textBoxArea').hide();
    $('#score').show();
    $('#points').text($('#points').text() + points);
}

function HideAlbumNames()
{
    $('#album1').hide();
    $('#album2').hide();
    $('#album3').hide();
    $('#question1').hide();
    $('#question2').hide();
    $('#question3').hide();
}

function DisplayQuestion(questionNumber)
{
    $('#album' + (questionNumber)).fadeIn(300);
    $('#question' + (questionNumber)).fadeIn(300);
}

function DisplayNextStep() {
    if (attemptNumber > TOTALGUESSES && roundNumber < TOTALROUNDS) {
        HideAlbumNames();
        attemptNumber = 0;
        GetAlbumsFromItunes();
    }
    else {
        DisplayQuestion(attemptNumber + 1);
        if ((roundNumber == TOTALROUNDS) && (attemptNumber - 1 == TOTALGUESSES)) {
            DisplayEndOfGame();
        }
    }
}

function GetAlbumsFromItunes() {
    var randomArtistId = artistIds[Math.floor(Math.random() * artistIds.length)];
    var url = "https://itunes.apple.com/lookup?id=" + randomArtistId + "&entity=album&limit=3";
    roundNumber++;
    SetRoundNumberTitle(roundNumber);
    $.ajax({
        type: "Get",
        url: url,
        dataType: 'jsonp',
        success: HandleAlbumList
    });
}

function SetRoundNumberTitle(roundNumber) {
    $('#roundTitle').text('Round #' + roundNumber + ':');
}

function SetArtistName(artistName) {
    gameArtistName = artistName.toLowerCase();
}

function SetAlbumNames(list) {
    $.each(list, function (index, value) {
        console.log('index: ' + index + ' ID: ' + value.id + ' Name: ' + value.name + ' Album: ' + value.albumName);
        $('#album' + (index + 1)).children("span.name").text(value.albumName);
        if ((index + 1) == 3) {
            $('#lastAlbum').attr("src", value.albumArt);
        }
    }
    );  
}

function HandleAlbumList(data) {
    var id = '';
    HideAlbumNames();
    var albumsList = new Array();
    $.each(data.results, function (index, value) {
        if ((value['artistId'] != undefined) && (value['collectionName'] != undefined)) {
            album = {
                id: value['artistId'],
                name: value['artistName'],
                albumName: value['collectionName'],
                albumArt: value['artworkUrl100']
            }
            albumsList.push(album);
        }
    });
    SetArtistName(albumsList[0].name);
    SetAlbumNames(albumsList);    
    DisplayQuestion(1);
}

function SendGuess() {    
    var artistNameGuessed = $('#nameOfArtist').val().toLowerCase().replace(/\s+/g, " ");
    if (artistNameGuessed == gameArtistName) {
        handleGuess(true);
        console.log('artistNameGuessed: ' + artistNameGuessed + ' is the same as: ' + gameArtistName);
    }
    else {
        handleGuess(false);
        console.log('artistNameGuessed: ' + artistNameGuessed + ' is NOT the same as: ' + gameArtistName);
    }
}

function DisplayPointsNum() {
    if (attemptNumber == 1)
        $('#pointsNum').text('5 points');
    if (attemptNumber == 2)
        $('#pointsNum').text('3 points');
    if (attemptNumber == 3)
        $('#pointsNum').text('1 point');
}


