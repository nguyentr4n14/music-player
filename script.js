const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $(".player")
const cd = $(".cd")
const heading = $("header h2")
const cdThumb = $(".cd-thumb")
const audio =  $("#audio")
const playBtn = $(".btn-toggle-play")
const progress = $("#progress")
const prevBtn = $(".btn-prev")
const nextBtn = $(".btn-next")
const randomBtn = $(".btn-random")
const repeatBtn = $(".btn-repeat")

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    song: [
        {
            name: "All of Me",
            singer: "John Legend",
            path: "./assets/music/allOfMe.mp3",
            image: "./assets/images/allOfMe.jpeg"
        }, 
        {
            name: "Thôi Em Đừng Đi",
            singer: "RPT MCK",
            path: "./assets/music/thoiEmDungDi.mp3",
            image: "./assets/images/thoiEmDungDi.jpg"
        },
        {
            name: "Catch Me If You Can",
            singer: "Quang Hùng MasterD",
            path: "./assets/music/catchMeIfYouCan.mp3",
            image: "./assets/images/catchMeIfYouCan.jpg"
        },
        {
            name: "Tình Yêu Không Thể Phá Vỡ",
            singer: "John Legend",
            path: "./assets/music/tinhYeuKhongThePhaVo.mp3",
            image: "./assets/images/tinhYeuKhongThePhaVo.jpg"
        },
        {
            name: "Bởi vì là khi yêu",
            singer: "Anh Tú",
            path: "./assets/music/boiViLaKhiYeu.mp3",
            image: "./assets/images/boiViLaKhiYeu.jpg"
        }, 
        {
            name: "Tệ thật, anh nhớ em",
            singer: "Orange",
            path: "./assets/music/teThatAnhNhoEm.mp3",
            image: "./assets/images/teThatAnhNhoEm.jpg"
        }, 
        {
            name: "Ngày đẹp trời để nói chia tay",
            singer: "Lou Hoàng",
            path: "./assets/music/ngayDepTroiDeNoiChiaTay.mp3",
            image: "./assets/images/ngayDepTroiDeNoiChiaTay.jpg"
        }
    ],
    render: function() {
        const html = this.song.map(song => {
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $(".playlist").innerHTML = html.join("")
    },
    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.song[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi click play 
        playBtn.onclick = function() {
            if (_this.isPlaying) {      
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi bài hát được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add("playing")
            cdThumbAnimate.play()
        }

        // Khi bài hát được pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing")
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua bài hát
        progress.oninput = function(e) {
            const seekTime = e.target.value / 100 * audio.duration
            audio.currentTime = seekTime
        }

        // Khi next bài hát
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
        }

        // Khi prev bài hát
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
        }

        // Khi bật / tắt random bài hát
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle("active", _this.isRandom)
        }

        // Xử lý lặp lại một bài hát
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle("active", _this.isRepeat)
        }

        // Xử lý bài hát kế tiếp khi audio kết thúc
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.song.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.song.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.song.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // Lắng nghe và xử lý các sự kiện (DOM Events)
        this.handleEvents()
        
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()
    }
}

app.start() 
