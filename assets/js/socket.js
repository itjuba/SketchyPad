// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import {Socket} from "phoenix"
import jQuery from "jquery"

let socket = new Socket("/socket", {params: {token: window.userToken}})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/3" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket, _connect_info) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, connect to the socket:
socket.connect()
jQuery(document).ready(function($) {
// Now that you are connected, you can join channels with a topic:


    const d = document.getElementById("myCanvas");
// c.addEventListener("click", penTool); // fires after mouse left btn is released
    d.addEventListener("mousedown", setLastCoords); // fires before mouse left btn is released
    d.addEventListener("mousemove", freeForm);


    const ctx = d.getContext("2d");

    function setLastCoords(e) {
        const {x, y} = d.getBoundingClientRect();
        lastX = e.clientX - x;
        lastY = e.clientY - y;
    }

    function freeForm(e) {
        if (e.buttons !== 1) return; // left button is not pushed yet
        penTool(e);
    }

    function penTool(e) {
        const {x, y} = d.getBoundingClientRect();
        const newX = e.clientX - x;
        const newY = e.clientY - y;

        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(newX, newY);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
        channel.push("new_msg"+":"+window.location.pathname.substr(1,), {body: [lastX,lastY,newX,newY]})

        lastX = newX;
        lastY = newY;
        // console.log(lastX)

    }

    let lastX = 0;
    let lastY = 0;
    let channelChat = socket.channel("room:chat"+window.location.pathname.substr(1,), {})

    let channel = socket.channel("room:"+window.location.pathname.substr(1,), {})
    let chatInput = document.querySelector("#chat-input")

    chatInput.addEventListener("keypress", event => {
        if (event.key === 'Enter') {
            console.log("clicking here")
            if(chatInput.value != "") {
                channelChat.push("chat:new_msg" + ":" + window.location.pathname.substr(1,), {body: chatInput.value})
                chatInput.value = ""
            }
        }
    })

    console.log(window.location.pathname.substr(1,)+":"+"new_msg")
    channel.on("new_msg"+":"+window.location.pathname.substr(1,), payload => {
        const ctx = d.getContext("2d");
        const {x, y} = d.getBoundingClientRect();
        let lastX = 0;
        let lastY = 0;
        console.log("new here")
        console.log('lastX')
        console.log(payload.body)
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(payload.body[0], payload.body[1]);
        ctx.lineTo(payload.body[2], payload.body[3]);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
        // lastX = newX;${payload.body}
        // lastY = newY;
        // $("#messages").append('<div class="container">\n' +
        //     '  <p> ' + payload.body  + ' </p>\n' +
        //     '</div>')


    })

    channelChat.on("chat:new_msg"+":"+window.location.pathname.substr(1,), payload => {

        $("#messages").append('<div class="container" style="border:2px solid #dedede;background-color: #f1f1f1;  border-radius: 5px;  padding: 10px;  margin: 10px 0;" >\n' +
            '  <p> ' + payload.body + ' </p>\n' +
            '</div>')

    })

    channelChat.join()
        .receive("ok", resp => {
            console.log("Joined successfully", resp)
        })
        .receive("error", resp => {
            console.log("Unable to join", resp)
        })

    channel.join()
        .receive("ok", resp => {
            console.log("Joined successfully", resp)
        })
        .receive("error", resp => {
            console.log("Unable to join", resp)
        })

});

export default socket
