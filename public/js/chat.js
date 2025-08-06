// CLIENT_SEND_MESSAGES
const formChatData = document.querySelector('[form-chat]')
if (formChatData) {
    formChatData.addEventListener('submit', (e) => {
        e.preventDefault()

        const content = e.target.elements.content.value
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGES", content);
            e.target.elements.content.value = "";
        }
    })
}
// END CLIENT_SEND_MESSAGES
// SERVER_RETURN_MESSAGES
socket.on("SERVER_RETURN_MESSAGES", (data) => {
    const body = document.querySelector('.chat-body');
    const userId = body.getAttribute('data-user-id');
    const div = document.createElement('div');

    let html = '';

    if (data.userID === userId) {
        div.classList.add('message', 'd-flex', 'flex-row', 'justify-content-end', 'mb-4');
        html = `
            <div class="p-3 me-3 border" style="border-radius: 15px; background-color: #fbfbfb;">
                <p class="small mb-0">${data.content}</p>
            </div>
        `;
    } else {
        div.classList.add('message', 'd-flex', 'flex-row', 'justify-content-start', 'mb-4');
        html = `
            <div class="p-3 ms-3" style="border-radius: 15px; background-color: rgba(57, 192, 237,.2);">
                <p>${data.fullName}</p>
                <p class="small mb-0">${data.content}</p>
            </div>
        `;
    }

    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
});
// END SERVER_RETURN_MESSAGES
