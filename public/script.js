const modal = document.getElementById("modal");
let socket = io();
let file_names = [];
let char_name = {};
// 画像のファイル名すべて代入
socket.on("file name", (name,json) => {
    file_names = name;
    char_name = json;
    init();

    let list = {};
    // 名前一覧の作成
    for( let n = 0; n < name.length; n++ ) {
        char = name[n].split(".")[0];
        let charactors = document.getElementById("charactors");
        let card = document.createElement("div");
        card.style.backgroundImage = `url(/assets/mini_charactors/${char}.png)`;
        card.dataset.id = char;
        card.classList.add("card");
        card.addEventListener("click", (e) => {
            if( confirm( `【${json[e.target.dataset.id]}】でよろしいですか？` ) ) {
                modal.style.display = "none";
                isAnswerCorrect( e.target.dataset.id );
            }
        })
        charactors.appendChild(card);
    }
} );

// 初期化
function init() {
    document.getElementById("log").innerHTML = "";
    // 画像生成
    create_image();
    // 小さなブロック10×10を配置する
    const block = document.getElementById("block");
    const addblock = (target) => {
        for( let n = 0; n < 100; n++ ) {
            const new_block = document.createElement("div");
            new_block.className = "block block_children";
            target.appendChild(new_block);
        }
    }
    if( !block.hasChildNodes() ) {
        addblock(block);
    } else {
        block.innerHTML = "";
        addblock(block);
    }
}

// ボタン押した時のキャラクター選択画面
const searchBox = document.querySelector(".searchBox");
searchBox.addEventListener("click", (e) => {
    // モーダルを出す
    modal.style.display = "block";
});

// ブロック消去関数
function delete_block() {
    const block_num = document.querySelectorAll(".block");
    if( block_num.length > 0 ) {
        const random_arr = create_random( 1, block_num.length, 5 );
        for( let n = 0; n < random_arr.length; n++ ) {
            block_num[random_arr[n]-1].style.zIndex = 10;
            block_num[random_arr[n]-1].classList.add("delete");
            block_num[random_arr[n]-1].classList.remove("block");
        }
    }
}

// 乱数生成関数
function create_random( min, max, range ) {
    let randoms = [];
    for(i = min; i <= range; i++){
        while(true){
            let tmp = Math.floor( Math.random() * (max - min + 1)) + min;
            if(!randoms.includes(tmp)){
                randoms.push(tmp);
            break;
          }
        }
    }
    return randoms;
}

// ランダムな画像をブロックに挿入する
function create_image() {
    let num = Math.floor( Math.random() * file_names.length );
    // ブロックに画像を挿入する
    const image = document.getElementById("image");
    image.src = `/assets/charactors/${file_names[num]}`;
    image.dataset.id = file_names[num].split(".")[0];
}

// 正誤判定
function isAnswerCorrect( click_id ) {
    const image = document.getElementById("image");
    if( image.dataset.id == click_id ) {
        // 正解判定
        const block_num = document.querySelectorAll(".block");
        block_num.forEach( (ele,num) => {
            ele.classList.add("delete");
            ele.classList.remove("block");
        } );
        setTimeout( () => {
            const log = document.getElementById("log");
            const pass = document.createElement("p");
            const char = document.createElement("p");
            pass.innerHTML = "正解です！！！ 初期化を押して続けて生成できます。";
            pass.style.textAlign = "center";
            pass.style.color = "white";
            char.innerHTML = `${char_name[click_id]}`;
            char.style.textAlign = "center";
            char.style.color = "white";
            log.appendChild(char);
            log.appendChild(pass);
        }, 3000 );
    } else {
        // 誤答判定
        const block_num = document.querySelectorAll(".block");
        block_num.forEach( (ele,num) => {
            ele.classList.add("delete_false");
            setTimeout( ()=> { ele.classList.remove("delete_false"); }, 3000 );
        } );
    }
}