import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
import { FileUploadWithPreview } from 'https://unpkg.com/file-upload-with-preview/dist/index.js'

// CLIENT_SEND_MESSAGES
//FileUploadWithPreview
const upload = new FileUploadWithPreview('upload-images', {
    multiple: true,
    maxFileCount: 10,
});

//End FileUploadWithPreview
const formChatData = document.querySelector('[form-chat]')
if (formChatData) {
    formChatData.addEventListener('submit', (e) => {
        e.preventDefault()

        const content = e.target.elements.content.value
        const images = upload.cachedFileArray
        console.log(images);

        if (content || images.length > 0) {
            socket.emit("CLIENT_SEND_MESSAGES", {
                content: content,
                images: images
            });
            e.target.elements.content.value = "";
            upload.resetPreviewPanel();
            upload.cachedFileArray = [];
            socket.emit("CLIENT_SEND_TYPING", "hidden")
        }
    })
}
// END CLIENT_SEND_MESSAGES
// SERVER_RETURN_ERROR
socket.on("SERVER_RETURN_ERROR", (data) => {
    alert(data.message);
});
// END SERVER_RETURN_ERROR
// SERVER_RETURN_MESSAGES
socket.on("SERVER_RETURN_MESSAGES", (data) => {
    const body = document.querySelector('.chat-body');
    const userId = body.getAttribute('data-user-id');
    const boxTying = document.querySelector(".inner-list-typing");

    // Render text message
    if (data.content) {
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
                    <p><b>${data.fullName}</b></p>
                    <p class="small mb-0">${data.content}</p>
                </div>
            `;
        }
        div.innerHTML = html;
        body.insertBefore(div, boxTying);
    }

    // Render images
    if (data.images && data.images.length > 0) {
        const div = document.createElement('div');
        let htmlImages = '<div class="inner-image">';
        data.images.forEach(image => {
            htmlImages += `<img src="${image}" alt="" width="100" height="100" style="margin: 5px; border-radius: 10px;">`;
        });
        htmlImages += '</div>';

        let html = '';
        if (data.userID === userId) {
            div.classList.add('message', 'd-flex', 'flex-row', 'justify-content-end', 'mb-4');
            html = htmlImages;
        } else {
            div.classList.add('message', 'd-flex', 'flex-row', 'justify-content-start', 'mb-4');
            if (data.content) {
                html = `
                    <div class="p-3 ms-3" style="border-radius: 15px; background-color: rgba(57, 192, 237,.2);">
                        ${htmlImages}
                    </div>
                `;
            } else {
                html = `
                    <div class="p-3 ms-3" style="border-radius: 15px; background-color: rgba(57, 192, 237,.2);">
                        <p><b>${data.fullName}</b></p>
                        ${htmlImages}
                    </div>
                `;
            }
        }
        div.innerHTML = html;
        body.insertBefore(div, boxTying);

        if (data.userID === userId) {
            upload.cachedFileArray = [];
            upload.clearPreviewPanel();
        }
        body.scrollTop = body.scrollHeight;
        const gallery = new Viewer(div);
    }

});
const body = document.querySelector('.chat-body');
if (body) {
    body.scrollTop = body.scrollHeight;
}
// END SERVER_RETURN_MESSAGES


// emoji-picker show popup 
const button = document.querySelector('.button-icon')
if (button) {
    const tooltip = document.querySelector('.tooltip')

    Popper.createPopper(button, tooltip)

    button.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}
// insert icon in input
const emojiPpicker = document.querySelector('emoji-picker')
// Show Typing
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show")
    clearTimeout(timeOut)
    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden")
    }, 3000)

}
// End Show Typing


if (emojiPpicker) {
    const input = document.querySelector("input[name=content]")
    emojiPpicker.addEventListener('emoji-click', event => {
        const icon = event.detail.unicode
        input.value = input.value + icon
        input.setSelectionRange(input.value.length, input.value.length)
        input.focus()
        showTyping()
    })
    // Input keyup

    input.addEventListener('keyup', (e) => {
        showTyping()

    })

    // End Input keyup
}
//SERVER_RETURN_TYPING
const elementListTying = document.querySelector(".inner-list-typing")
if (elementListTying) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type == "show") {
            const exitsTyping = elementListTying.querySelector(`[user-id="${data.userID}"]`)
            if (!exitsTyping) {
                const boxTyping = document.createElement("div")
                boxTyping.classList.add("box-typing")
                boxTyping.setAttribute("user-id", data.userID)
                boxTyping.innerHTML = `
            <div class="inner-name"> ${data.fullName}</div>
                <div class="inner-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
        `
                elementListTying.appendChild(boxTyping)
                body.scrollTop = body.scrollHeight;
            }

        } else {
            const BoxTyingRemove = elementListTying.querySelector(`[user-id="${data.userID}"]`)
            if (BoxTyingRemove) {
                elementListTying.removeChild(BoxTyingRemove)
            }
        }
    })
}

// end SERVER_RETURN_TYPING
// Preview Full Image
const bodyPreviewImage = document.querySelector('.chat-body');
if (bodyPreviewImage) {
    const gallery = new Viewer(bodyPreviewImage);
}
// End Preview Full Image
