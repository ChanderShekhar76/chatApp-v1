const socket = io()
const $messageForm = document.querySelector('#message-form')
const $message = $messageForm.querySelector('input')
const $messageButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')

const $messages = document.querySelector('#message-section')
const $messageScript = document.querySelector('#message-script').innerHTML
const $locationScript = document.querySelector('#location-script').innerHTML
const sidebarTemplete = document.querySelector('#sidebar-templete').innerHTML

const autoscroll = () => {
    //new message eleement
    const $newElement = $messages.lastElementChild

    //height of the new message
    const newMessageStyle = getComputedStyle($newElement)
    const margin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newElement.offsetHeight + margin
    //visible height
    const visibleHeight = $messages.offsetHeight

    //height of messages container
    const containerHeight = $messages.scrollHeight
    //how much far scoll has done
    const scrollOffset = visibleHeight + $messages.scrollTop
    if (containerHeight - newMessageHeight >= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}
//get username and room
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
socket.on('welcomeMsg', (message) => {
    const html = Mustache.render($messageScript, { username: message.username, message: message.message, createdAt: moment(message.createdAt).format('h:mm a') })
    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll()
})
$messageForm.addEventListener("submit", (e) => {
    $messageButton.setAttribute('disabled', 'disabled')
    e.preventDefault();
    const msg = e.target.elements.message.value
    socket.emit('sendMsg', msg, () => {
        $messageButton.removeAttribute('disabled')
        $message.value = ""
        $message.focus()
    })
})
document.querySelector('#send-location').addEventListener('click', () => {
    $sendLocationButton.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) return alert("Geo location is not supported by your browser")
    navigator.geolocation.getCurrentPosition((currentPosition) => {
        const coords = {}
        coords['latitude'] = currentPosition.coords.latitude
        coords['longitude'] = currentPosition.coords.longitude
        socket.emit('sendLocation', coords, () => {
            $sendLocationButton.removeAttribute('disabled')
        })
    })
})
socket.on('locationMessage', (url) => {
    const html = Mustache.render($locationScript, { username: url.username, url: url.url, createdAt: moment(url.createdAt).format('h:mm a') })
    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll()
})

socket.emit('join', ({ username, room }), (err) => {
    if (err) {
        alert(err)
        location.href = "/"
    }

})
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplete, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})