//#region Selection registration - vote mode
let candidateNum = 0;
let candidateList = [];
let isVoteSuspended = true;
let totalvoters;
let voteName;

//Create candidate function
function createCandidate() {
    if (candidateNum >= 9) {
        Swal.fire({
            title: "오류!",
            text: "후보/선택지는 9명까지만 가능합니다!",
            icon: "error",
            confirmButtonText: "확인"
        })
    } else {
        let newListItem = document.createElement("li")
        newListItem.classList.add("list-group-item", "d-flex")
        newListItem.innerHTML = `<input type="text" placeholder="선택지 / 후보 입력" class="form-control"><button class="button-not-button" onclick="deleteCandidate(${candidateNum})"><i class="bi bi-x-lg"></i></button>`
        $("#candidate-list-group").appendChild(newListItem)
        candidateNum++;
        giveNewIDNumber();
    }
}

function resetCandidate() {
    Swal.fire({
        title: "모든 입력된 정보 삭제?",
        text: "모든 입력된 정보를 삭제할까요? 삭제후에는 되돌릴수 없습니다!",
        icon: "warning",
        showConfirmButton: true,
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소"
    }).then(function (result) {
        if (result.isConfirmed) {
            $("#candidate-list-group").innerHTML = "";
            candidateNum = 0;
            $("#vote-name").value = "";
            $("#total-voters").value = "";
            Swal.fire({
                title: "처리 완료",
                text: "모든 입력된 정보가 정상 삭제되었습니다.",
                icon: "success",
                confirmButtonText: "확인"
            })
        }
    })
}

function deleteCandidate(id) {
    console.log(document.querySelectorAll("#candidate-list-group>li.list-group-item")[id])
    document.querySelectorAll("#candidate-list-group>li.list-group-item")[id].remove();
    candidateNum--;
    giveNewIDNumber();
}

function giveNewIDNumber() {
    document.querySelectorAll("#candidate-list-group>li.list-group-item>button").forEach(function (value, index) {
        value.setAttribute("onclick", "deleteCandidate(" + index + ")")
    })
}


//#endregion

//#region Vote State
function startVote() {
    if ($("#vote-name").value == "") {
        Swal.fire({
            title: "비어있는 정보칸",
            text: "투표 이름이 입력되지 않았습니다.",
            icon: "error"
        })
    } else if (document.querySelectorAll("#candidate-list-group>li").length < 2) {
        Swal.fire({
            title: "후보 / 선택지 부족",
            text: "후보 / 선택지가 2개 미만입니다.",
            icon: "error"
        })
    } else if (parseInt($("#total-voters").value) < 2 || !parseInt($("#total-voters").value)) {
        Swal.fire({
            title: "유권자 부족",
            text: "유권자는 2명 이상이어야 합니다.",
            icon: "error"
        })
    } else {
        Swal.fire({
            title: "투표 시작하기",
            text: "투표를 시작하면 입력된 정보는 수정이 불가합니다. 추가로 투표가 시작되면 전체화면으로 전환됩니다. 안내에 따른 숫자키를 누르면 투표가됩니다. 계속하시겠습니까?",
            icon: "warning",
            showConfirmButton: true,
            showCancelButton: true,
            showDenyButton: false,
            confirmButtonText: "계속",
            cancelButtonText: "취소"
        }).then(function (result) {
            if (result.isConfirmed) {
                voteInitializer()
            }
        })
    }
    
}

function voteInitializer() {
    candidateList = [{candidateName: "기권", vote: 0}]
    document.querySelectorAll("#candidate-list-group>li.list-group-item>input").forEach(function (value) {
        candidateList.push({candidateName: value.value, vote: 0})
    })
    totalvoters = $("#total-voters").value
    voteName = $("#vote-name").value
    //Set keyboard shortcut
    window.onkeydown = keyboardHandler
    $("#setUpScreen").classList.add("d-none")
    $("#voteScreen").classList.remove("d-none")
    $("html").requestFullscreen();
    $("#keyPressGuide").innerHTML = "";
    $("#vote-name-view").innerHTML = voteName;
    candidateList.forEach(function (value, index) {
        $("#keyPressGuide").innerHTML += `<li>${value.candidateName} : ${index}</li>`
    })
    isVoteSuspended = false
}

function keyboardHandler(e) {
    if (!isVoteSuspended) {
        //Vote is running
        if ((e.keyCode - 48) >= 0 && (e.keyCode - 48) < candidateList.length) {
            console.log("ACCEPTED KEYBOARDINPUT ", e)
            isVoteSuspended = true;
            candidateList[(e.keyCode - 48)].vote++;
            //Calculate num voted...
            let numvoted = 0
            candidateList.forEach(function (value) {
                numvoted += value.vote;
            })
            if (numvoted < totalvoters) {
                Swal.fire({
                    title: "투표에 참여해주셔서 감사합니다.",
                    text: `현재 ${numvoted}명이 참여하였으며 앞으로 ${totalvoters - numvoted}명이 참여해야합니다.`,
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(function () {
                    isVoteSuspended = false;
                })
                
            } else {
                //Vote complete!
                voteCompleteHandler()
            }
        } else if ((e.keyCode - 96) >= 0 && (e.keyCode - 96) < candidateList.length) {
            console.log("ACCEPTED KEYBOARDINPUT ", e)
            isVoteSuspended = true;
            candidateList[(e.keyCode - 96)].vote++;
            //Calculate num voted...
            let numvoted = 0
            candidateList.forEach(function (value) {
                numvoted += value.vote;
            })
            if (numvoted < totalvoters) {
                Swal.fire({
                    title: "투표에 참여해주셔서 감사합니다.",
                    text: `소중한 한표 감사합니다. 현재 ${numvoted}명이 참여하였으며 앞으로 ${totalvoters - numvoted}명이 참여해야합니다.`,
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(function () {
                    isVoteSuspended = false;
                })
                
            } else {
                //Vote complete!
                voteCompleteHandler()
            }
        }
    } else {
        console.log("VOTE LOCKED")
    }
}

function voteCompleteHandler() {
    console.log("ALL VOTE COMPLETE", candidateList)
    Swal.fire({
        title: "결과공개",
        html: "결과가 <b></b>초 뒤에 공개됩니다.",
        timer: 5000,
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector("b")
            timerInterval = setInterval(() => {
                b.textContent = Math.round(Swal.getTimerLeft() / 1000)
            }, 50);
        },
        willClose: () => {
            clearInterval(timerInterval)
        },
        timerProgressBar: true
    }).then(function (result) {
        $("#voteResultScreen").classList.remove("d-none")
        $("#voteScreen").classList.add("d-none")
        $("#voteResultTableView").innerHTML = "<tr><td>후보 / 선택지 이름</td><td>득표수</td></tr>"
        candidateList.forEach(function (value, index) {
            $("#voteResultTableView").innerHTML += `<tr><td>${value.candidateName}</td><td>${value.vote}</td></tr>`
        })

    })
}

function saveVoteResult() {
    let ExcelifiedData = voteName + ",에 대한 투표결과\n후보 / 선택지 이름,득표수"
    candidateList.forEach(function (value) {
        ExcelifiedData += `\n${value.candidateName},${value.vote}`
    })
    window.externalfunctions.saveCSV(ExcelifiedData)
}


//#endregion

//#region Possibility registration - random mode
let randomList = [];
let possibleNum = 0;
function createPossible() {
    let newListItem = document.createElement('li')
    newListItem.classList.add("list-group-item", "d-flex")
    newListItem.innerHTML = `<input type="text" placeholder="선택지 / 후보 입력" class="form-control"><button class="button-not-button" onclick="deletePossible(${possibleNum})"><i class="bi bi-x-lg"></i></button>`
    $("#possible-list-group").appendChild(newListItem)
    possibleNum++;
    giveNewRandomIDNumber();
}

function giveNewRandomIDNumber() {
    document.querySelectorAll("#possible-list-group>li.list-group-item>button").forEach(function (value, index) {
        value.setAttribute("onclick", "deletePossible(" + index + ")")
    })
}

function deletePossible(id) {
    document.querySelectorAll("#possible-list-group>li.list-group-item")[id].remove();
    possibleNum--;
    giveNewRandomIDNumber();
}

function resetPossible() {
    Swal.fire({
        title: "모든 입력된 정보 삭제?",
        text: "모든 입력된 정보를 삭제할까요? 삭제후에는 되돌릴수 없습니다!",
        icon: "warning",
        showConfirmButton: true,
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소"
    }).then(function (result) {
        if (result.isConfirmed) {
            $("#possible-list-group").innerHTML = "";
            possibleNum = 0;
            $("#random-name").value = "";
            Swal.fire({
                title: "처리 완료",
                text: "모든 입력된 정보가 정상 삭제되었습니다.",
                icon: "success",
                confirmButtonText: "확인"
            })
        }
    })
}

function showRandomIsNotRandomWarning() {
    Swal.fire({
        title: "더 알아보기",
        html: "컴퓨터는 난수를 생성할 수 없습니다. 단지 난수를 생성하는 척 하는것입니다. 이 뽑기 프로그램은 난수를 필요로 하는데, 이때 Javascript의 <code>Math.random()</code> 함수를 사용합니다. 이 함수는 시간을 기반으로 난수를 생성하는데, 이값은 완전한 무작위가 아닙니다. 그런이유로 같은값이 여러번 나올수도 있습니다. 해당 내용을 염두에 두시고 진행하시기 바랍니다."
    })
}

//#endregion

//#region Start random
let randomResultNum;
function startRandom() {
    if(document.querySelectorAll("#possible-list-group>li.list-group-item").length < 2) {
        Swal.fire({
            title: "후보 / 선택지 부족",
            text: "후보 / 선택지가 2개 미만입니다."
        })
    } else {
        randomInitializer()
    }
}

function randomInitializer() {
    randomList = []
    randomResultNum = undefined
    document.querySelectorAll("#possible-list-group>li.list-group-item>input").forEach(function (value) {
        randomList.push(value.value)
    })
    //Change screen
    $("#setUpScreen").classList.add("d-none")
    $("#randomResultScreen").classList.remove("d-none")
    $("#random-result-name").innerHTML = $("#random-name").value
    $("html").requestFullscreen()
    //Do random
    doRandom()
}

function doRandom() {
    Swal.fire({
        title: "추첨",
        text: "과연 결과는?",
        timer: 5000,
        showConfirmButton: false,
        timerProgressBar: true
    }).then(function () {
        randomResultNum = getRandomInt(randomList.length - 1)
        $("#random-result-text").innerText = randomList[randomResultNum]

    })

}

function doRandomAgainWithoutThis() {
    if (randomList.length < 3) {
        Swal.fire({
            title: "후보 / 선택지 부족",
            text: "뽑힌 후보 / 선택지를 제외하면 후보 / 선택지가 부족해 더이상 진행할수없습니다."
        })
    } else {
        doRandom()
        randomList.splice(randomResultNum, 1)
    }
}

//#endregion

//#region Quick commmands
function $(query) {
    return document.querySelector(query)
}

function getRandomInt(rangeEnd) {
    min = 0
    max = rangeEnd
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//#endregion