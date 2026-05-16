import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<any>;
    }
}

let echo: Echo<any> | null = null;

if (typeof window !== "undefined") {

    window.Pusher = Pusher;

    echo = new Echo({
        broadcaster: "reverb",

        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY!,

        wsHost:
            process.env.NEXT_PUBLIC_REVERB_HOST || "127.0.0.1",

        wsPort: Number(
            process.env.NEXT_PUBLIC_REVERB_PORT || 8080
        ),

        wssPort: Number(
            process.env.NEXT_PUBLIC_REVERB_PORT || 8080
        ),

        forceTLS: false,

        enabledTransports: ["ws", "wss"],

        authEndpoint:
            "http://127.0.0.1:8000/api/broadcasting/auth",

        auth: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                Accept: "application/json",
            },
        },
    });

    window.Echo = echo;
}

export default echo;