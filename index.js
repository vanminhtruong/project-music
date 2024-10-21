// Elements (selectors)
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const loopBtn = document.getElementById('loop-btn');
const progressBar = document.getElementById('progress-bar');
const progressFilled = document.getElementById('progress-filled');
const currentTimeElem = document.getElementById('current-time');
const totalDurationElem = document.getElementById('total-duration');
const songNameElem = document.getElementById('song-name');
const songList = document.getElementById('song-list');
const playlistBtn = document.getElementById('playlist-btn');

const playerState = {
    isPlaying: false,
    isLooping: false,
    currentSongIndex: 0,
    songs: ['Recording 2024-10-16 225212.mp4', 'don.mp3', 'len.mp3','remix.mp3','see.mp3'],
};

let isDragging = false;

function setIsPlaying(value) {
    playerState.isPlaying = value;
    if (value) {
        audioPlayer.play();
        updatePlayButtonIcon('pause');
        addProgressUpdate();
    } else {
        audioPlayer.pause();
        updatePlayButtonIcon('play');
        removeProgressUpdate();
    }
}

function setIsLooping(value) {
    playerState.isLooping = value;
    audioPlayer.loop = value;
    updateLoopButtonIcon();
}

function setCurrentSongIndex(value) {
    const oldValue = playerState.currentSongIndex;
    alert("Bài hát cũ: " + oldValue);
    playerState.currentSongIndex = value;
    loadSong(playerState.songs[value]);
    updatePlaylist();
    // Kiểm tra xem bài hát đã thay đổi hay chưa
    if (oldValue !== value) {
        // Nếu bài hát đã thay đổi, tự động phát bài hát mới
        alert(oldValue !== value);
        playSong();
    }
}

// Khởi tạo trình phát nhạc
function initPlayer() {
    loadSong(playerState.songs[playerState.currentSongIndex]);
    resetPlayerUI();
    addEventListeners();
    updatePlaylist();
}

// Tải bài hát vào trình phát
// Vai trò: Cập nhật nguồn âm thanh và hiển thị tên bài hát
function loadSong(song) {
    audioPlayer.src = song;
    audioPlayer.load();
    songNameElem.textContent = song;
}

// Chuyển đổi giữa phát và tạm dừng
function togglePlayPause() {
    setIsPlaying(!playerState.isPlaying);
}

// Phát bài hát
function playSong() {
    setIsPlaying(true);
}

// Chuyển đổi bài hát (tiến hoặc lùi)
function changeSong(forward = true) {
    const newIndex = forward ? 
        (playerState.currentSongIndex + 1) % playerState.songs.length : 
        (playerState.currentSongIndex - 1 + playerState.songs.length) % playerState.songs.length;
    setCurrentSongIndex(newIndex);
}

// Bật/tắt chế độ lặp lại
function toggleLoop() {
    setIsLooping(!playerState.isLooping);
}

// Xử lý khi bài hát kết thúc
function handleSongEnd() {
    if (!playerState.isLooping) {
        changeSong(true);
    }
}

// Cập nhật thanh tiến trình và thời gian
function updateProgress() {
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressFilled.style.width = `${progressPercent}%`;
    currentTimeElem.textContent = formatTime(audioPlayer.currentTime);
    totalDurationElem.textContent = `- ${formatTime(audioPlayer.duration - audioPlayer.currentTime)}`;
}

// Đặt tổng thời gian của bài hát
function setTotalDuration() {
    totalDurationElem.textContent = formatTime(audioPlayer.duration);
}

// Cập nhật thời gian hiện tại khi kéo thanh tiến trình
function setProgress(e) {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
    updateProgress();
}



function startDrag(e) {
    isDragging = true;
    setProgress(e);
}

function stopDrag() {
    if (isDragging) {
        isDragging = false;
    }
}

function dragProgress(e) {
    if (isDragging) {
        const rect = progressBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const clampedX = Math.max(0, Math.min(offsetX, rect.width));
        audioPlayer.currentTime = (clampedX / rect.width) * audioPlayer.duration;
        updateProgress();
    }
}

// Cập nhật biểu tượng nút phát/tạm dừng
function updatePlayButtonIcon(state) {
    playBtn.innerHTML = state === 'play' ? '&#9654;' : '&#10074;&#10074;';
}

// Cập nhật biểu tượng nút lặp lại
function updateLoopButtonIcon() {
    loopBtn.style.color = playerState.isLooping ? 'red' : 'white';
}

// Định dạng thời gian từ giây sang phút:giây
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Đặt lại giao diện người dùng của trình phát
function resetPlayerUI() {
    progressFilled.style.width = '0%';
    currentTimeElem.textContent = '00:00';
    totalDurationElem.textContent = '00:00';
    removeProgressUpdate(); 
}

// Cập nhật danh sách phát
function updatePlaylist() {
    songList.innerHTML = '';
    playerState.songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song;
        li.classList.add('song-item');
        if (index === playerState.currentSongIndex) {
            li.classList.add('active');
        }
        li.addEventListener('click', () => {
            playerState.currentSongIndex = index;
        });
        songList.appendChild(li);
    });
}

// Chuyển đổi hiển thị/ẩn danh sách phát
function togglePlaylistVisibility() {
    const playlist = document.querySelector('.playlist');
    playlist.style.display = playlist.style.display === 'none' ? 'block' : 'none';
}

// Thêm các sự kiện lắng nghe cho các nút điều khiển và progress bar
function addEventListeners() {
    playBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', () => changeSong(false));
    nextBtn.addEventListener('click', () => changeSong(true));
    loopBtn.addEventListener('click', toggleLoop);
    
    // Updated event listeners for div-based progress bar
    progressBar.addEventListener('click', setProgress);
    progressBar.addEventListener('mousedown', startDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('mousemove', dragProgress);
    
    audioPlayer.addEventListener('loadedmetadata', setTotalDuration);
    audioPlayer.addEventListener('ended', handleSongEnd);
    playlistBtn.addEventListener('click', togglePlaylistVisibility);
}

// Các hàm không còn sử dụng vì đã chuyển sang div-based progress bar
function removeProgressUpdate() {
    audioPlayer.removeEventListener('timeupdate', updateProgress);
}

function addProgressUpdate() {
    audioPlayer.addEventListener('timeupdate', updateProgress);
}

// Khởi tạo trình phát khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', initPlayer);
